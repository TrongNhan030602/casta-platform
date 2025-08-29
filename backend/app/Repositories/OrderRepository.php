<?php
namespace App\Repositories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderHistory;
use App\Interfaces\OrderInterface;
use App\Enums\OrderStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OrderRepository implements OrderInterface
{
    public function search(array $filters): LengthAwarePaginator
    {
        $query = Order::query()->with(['items.product', 'customer.user']);

        if (!empty($filters['status'])) {
            $status = OrderStatus::tryFrom($filters['status']);
            if ($status) {
                $query->where('status', $status->value); // đảm bảo đúng value enum
            }
        }

        $perPage = $filters['per_page'] ?? 15;
        return $query->paginate($perPage);
    }

    public function find(int $id): Order
    {
        return Order::with(['items.product', 'customer.user', 'histories.user'])
            ->findOrFail($id);
    }

    public function store(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'];
            unset($data['items']);

            /** @var Order $order */
            $order = Order::create($data);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                ]);
            }

            OrderHistory::create([
                'order_id' => $order->id,
                'status' => $order->status, // enum cast sẵn
                'changed_by' => $data['customer_id'],
                'note' => 'Đơn hàng mới được tạo',
            ]);

            return $order->load(['items.product', 'customer.user']);
        });
    }

    public function updateStatus(Order $order, OrderStatus $status, int $changedBy, ?string $note = null): Order
    {
        return DB::transaction(function () use ($order, $status, $changedBy, $note) {
            $order->update(['status' => $status->value]);

            OrderHistory::create([
                'order_id' => $order->id,
                'status' => $status->value,
                'changed_by' => $changedBy,
                'note' => $note,
            ]);

            return $order->refresh()->load(['items.product', 'customer.user', 'histories.user']);
        });
    }
}