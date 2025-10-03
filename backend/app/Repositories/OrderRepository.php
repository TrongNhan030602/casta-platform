<?php

namespace App\Repositories;

use App\Models\Order;
use RuntimeException;
use App\Models\SubOrder;
use App\Models\OrderItem;
use App\Enums\OrderStatus;
use App\Models\Transaction;
use App\Enums\TransactionMethod;
use App\Enums\TransactionStatus;
use App\Enums\ProductStockLogType;
use App\Interfaces\OrderInterface;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OrderRepository implements OrderInterface
{
    /**
     * Tạo đơn hàng kèm sub_orders và order_items
     * Tích hợp stock log và check tồn kho
     */
    public function storeOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {

            $customerId = auth()->user()->customer?->id;
            if (!$customerId) {
                throw new RuntimeException("User does not have a linked customer profile.");
            }

            // Tạo order chính
            $order = Order::create([
                'customer_id' => $customerId,
                'note' => $data['note'] ?? null,
                'status' => $data['status'] ?? OrderStatus::PENDING,
                'payment_status' => $data['payment_status'] ?? null,
                'payment_method' => $data['payment_method'] ?? null,
                'total_amount' => 0,
                'shipping_fee_total' => 0,
            ]);

            // Lấy tất cả product_id trong order để batch load, tránh N+1
            $productIds = [];
            foreach ($data['sub_orders'] as $sub) {
                foreach ($sub['items'] as $item) {
                    $productIds[] = $item['product_id'];
                }
            }
            $products = \App\Models\Product::whereIn('id', array_unique($productIds))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            // Tạo subOrders và orderItems
            foreach ($data['sub_orders'] as $subData) {
                $subOrder = $order->subOrders()->create([
                    'enterprise_id' => $subData['enterprise_id'],
                    'shipping_fee' => $subData['shipping_fee'],
                    'status' => $subData['status'] ?? \App\Enums\SubOrderStatus::PENDING,
                    'tracking_number' => $subData['tracking_number'] ?? null,
                    'note' => $subData['note'] ?? null,
                    'sub_total' => 0,
                ]);

                $subTotal = 0;

                foreach ($subData['items'] as $itemData) {
                    $product = $products[$itemData['product_id']] ?? null;
                    if (!$product) {
                        throw new RuntimeException("Sản phẩm #{$itemData['product_id']} không tồn tại.");
                    }

                    if ($product->stock < $itemData['quantity']) {
                        throw new RuntimeException(
                            "Sản phẩm {$product->name} không đủ tồn kho. Có sẵn: {$product->stock}"
                        );
                    }

                    // Tạo order item
                    $item = new OrderItem([
                        'product_id' => $product->id,
                        'quantity' => $itemData['quantity'],
                        'price' => $itemData['price'],
                        'total_price' => $itemData['quantity'] * $itemData['price'],
                        'note' => $itemData['note'] ?? null,
                    ]);
                    $subOrder->items()->save($item);
                    $subTotal += $item->total_price;

                    // Ghi stock log
                    $product->stockLogs()->create([
                        'type' => ProductStockLogType::SALE,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->price,
                        'note' => "Trừ kho do đơn hàng #{$order->id}",
                        'stock_after' => $product->stock - $item->quantity,
                    ]);

                    $product->recalculateStock();
                }

                $subOrder->sub_total = $subTotal;
                $subOrder->save();
            }

            // Tính tổng tiền và phí ship từ subOrders
            $order->total_amount = $order->calculateTotalAmount();
            $order->shipping_fee_total = $order->calculateTotalShippingFee();
            $order->save();

            return $order->load(['customer', 'subOrders.items', 'transactions', 'statusHistories']);
        });
    }

    public function storeTransaction(Order $order, array $data, ?int $subOrderId = null): Transaction
    {
        $amount = $data['amount'] ?? 0;
        $method = $data['method'] ?? null;
        $status = $data['status'] ?? TransactionStatus::PENDING->value;

        // Validate cơ bản
        if ($amount <= 0) {
            throw new \InvalidArgumentException("Số tiền thanh toán phải lớn hơn 0.");
        }

        if (!TransactionMethod::tryFrom($method)) {
            throw new \InvalidArgumentException("Phương thức thanh toán không hợp lệ.");
        }

        if (!TransactionStatus::tryFrom($status)) {
            throw new \InvalidArgumentException("Trạng thái giao dịch không hợp lệ.");
        }

        // Nếu có subOrderId thì kiểm tra subOrder thuộc order
        if ($subOrderId) {
            $subOrder = $order->subOrders()->find($subOrderId);
            if (!$subOrder) {
                throw new \InvalidArgumentException("SubOrder không tồn tại hoặc không thuộc Order này.");
            }
        }

        // Check trùng theo reference_code (nếu có)
        if (!empty($data['reference_code'])) {
            $exists = Transaction::where('reference_code', $data['reference_code'])->exists();
            if ($exists) {
                throw new \InvalidArgumentException("Transaction với reference_code này đã tồn tại.");
            }
        }

        // Check trùng Pending theo SubOrder + amount + method
        $existsPending = Transaction::where('order_id', $order->id)
            ->when($subOrderId, fn($q) => $q->where('sub_order_id', $subOrderId))
            ->where('amount', $amount)
            ->where('method', $method)
            ->where('status', TransactionStatus::PENDING->value)
            ->exists();

        if ($existsPending) {
            throw new \InvalidArgumentException("Đã có giao dịch pending với số tiền & phương thức này.");
        }

        // Tạo transaction
        return DB::transaction(function () use ($order, $data, $subOrderId, $amount, $method, $status) {
            $transaction = new Transaction([
                'order_id' => $order->id,
                'sub_order_id' => $subOrderId,
                'amount' => $amount,
                'method' => $method,
                'status' => $status,
                'reference_code' => $data['reference_code'] ?? null,
                'note' => $data['note'] ?? null,
                'paid_at' => $data['paid_at'] ?? null,
            ]);

            $transaction->save();

            return $transaction->fresh();
        });
    }


    /**
     * Lấy chi tiết đơn hàng theo id
     */
    public function getById(int $orderId): ?Order
    {
        return Order::with([
            'subOrders.items',
            'transactions',
            'statusHistories',
            'customer',
        ])->find($orderId);
    }

    /**
     * Lấy danh sách đơn hàng phân trang với filter
     */
    public function listOrders(array $filters): LengthAwarePaginator
    {
        $query = Order::with(['customer', 'subOrders.enterprise', 'transactions']);

        if (!empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (!empty($filters['status']) && in_array($filters['status'], OrderStatus::values())) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['from'])) {
            $query->where('created_at', '>=', $filters['from']);
        }
        if (!empty($filters['to'])) {
            $query->where('created_at', '<=', $filters['to']);
        }

        $sortBy = in_array($filters['sort_by'] ?? '', ['created_at', 'total_amount']) ? $filters['sort_by'] : 'created_at';
        $sortOrder = in_array(strtolower($filters['sort_order'] ?? ''), ['asc', 'desc']) ? $filters['sort_order'] : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $filters['per_page'] ?? 12;
        return $query->paginate($perPage);
    }

    /**
     * Cập nhật trạng thái đơn hàng với rollback tồn kho khi CANCELLED
     */
    public function updateStatus(Order $order, OrderStatus|string $newStatus, ?int $changedBy = null): Order
    {
        $newStatusEnum = $newStatus instanceof OrderStatus ? $newStatus : OrderStatus::tryFrom($newStatus);
        if (!$newStatusEnum) {
            throw new \InvalidArgumentException("Trạng thái không hợp lệ: {$newStatus}");
        }

        if (!$order->status->canTransitionTo($newStatusEnum)) {
            throw new RuntimeException(
                "Không thể chuyển trạng thái từ {$order->status->value} sang {$newStatusEnum->value}"
            );
        }

        return DB::transaction(function () use ($order, $newStatusEnum, $changedBy) {

            if ($newStatusEnum === OrderStatus::CANCELLED) {
                foreach ($order->subOrders as $subOrder) {
                    foreach ($subOrder->items as $item) {
                        $product = $item->product;
                        if (!$product)
                            continue;

                        $product->stockLogs()->create([
                            'type' => ProductStockLogType::RETURN_SALE,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->price,
                            'note' => "Hoàn kho do hủy đơn #{$order->id}",
                            'stock_after' => $product->stock + $item->quantity,
                        ]);

                        $product->recalculateStock();
                    }
                }
            }

            $order->status = $newStatusEnum;
            $order->save();

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => $newStatusEnum->value,
                'changed_by' => $changedBy,
            ]);

            return $order->fresh();
        });
    }

    public function softDelete(Order $order): bool
    {
        return DB::transaction(function () use ($order) {
            // xóa mềm items
            foreach ($order->subOrders as $subOrder) {
                $subOrder->items()->delete();
            }

            // xóa mềm sub_orders
            $order->subOrders()->delete();

            // xóa mềm order
            return $order->delete();
        });
    }

    public function restoreOrder(Order $order): bool
    {
        return DB::transaction(function () use ($order) {
            $order->restore();

            foreach ($order->subOrders()->withTrashed()->get() as $subOrder) {
                $subOrder->restore();
                $subOrder->items()->withTrashed()->restore();
            }

            return true;
        });
    }


    public function findWithTrashed(int $id): ?Order
    {
        return Order::withTrashed()->find($id);
    }
    public function forceDelete(Order $order): bool
    {
        return DB::transaction(function () use ($order) {
            foreach ($order->subOrders()->withTrashed()->get() as $subOrder) {
                $subOrder->items()->withTrashed()->forceDelete();
                $subOrder->forceDelete();
            }

            return $order->forceDelete();
        });
    }

}