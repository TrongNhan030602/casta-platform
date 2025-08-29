<?php
namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Enums\OrderStatus;
use App\Interfaces\OrderInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class OrderService
{
    protected OrderInterface $repo;

    public function __construct(OrderInterface $repo)
    {
        $this->repo = $repo;
    }

    public function search(array $filters)
    {
        return $this->repo->search($filters);
    }

    public function find(int $id): Order
    {
        return $this->repo->find($id);
    }

    public function create(array $data): Order
    {
        $user = Auth::user();
        $data['customer_id'] = $user->customer->id;

        // ✅ dùng enum thay vì string
        $data['status'] = OrderStatus::PENDING;
        $data['discount'] = $data['discount'] ?? 0;

        $itemsData = [];
        $total = 0;

        foreach ($data['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);

            if ($product->stock < $item['quantity']) {
                throw ValidationException::withMessages([
                    'stock' => "Sản phẩm {$product->name} không đủ tồn kho."
                ]);
            }

            $unitPrice = $product->discount_price ?? $product->price;
            $lineTotal = $unitPrice * $item['quantity'];

            $itemsData[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'total_price' => $lineTotal,
            ];

            $total += $lineTotal;

            $product->decrement('stock', $item['quantity']);
        }

        $data['total_price'] = $total;
        $data['final_price'] = $total - $data['discount'];
        $data['items'] = $itemsData;

        return $this->repo->store($data);
    }

    // ✅ chỉnh typehint để dùng enum
    public function updateStatus(Order $order, OrderStatus $status, ?string $note = null): Order
    {
        return $this->repo->updateStatus($order, $status, Auth::id(), $note);
    }
}