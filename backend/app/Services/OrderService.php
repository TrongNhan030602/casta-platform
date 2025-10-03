<?php
namespace App\Services;

use App\Interfaces\OrderInterface;
use App\Models\Order;
use App\Models\SubOrder;
use App\Models\Transaction;
use App\Enums\OrderStatus;
use App\Enums\TransactionStatus;
use App\Enums\TransactionMethod;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class OrderService
{
    protected OrderInterface $repo;

    public function __construct(OrderInterface $repo)
    {
        $this->repo = $repo;
    }

    public function createOrder(array $data): Order
    {
        return $this->repo->storeOrder($data);
    }

    public function getOrderById(int $orderId): ?Order
    {
        return $this->repo->getById($orderId);
    }

    public function listOrders(array $filters): LengthAwarePaginator
    {
        return $this->repo->listOrders($filters);
    }

    public function updateOrderStatus(Order $order, string|OrderStatus $newStatus, ?int $changedBy = null): Order
    {
        return $this->repo->updateStatus($order, $newStatus, $changedBy);
    }

    public function createTransaction(Order $order, array $data, ?int $subOrderId = null): Transaction
    {
        return $this->repo->storeTransaction($order, $data, $subOrderId);
    }


    /**
     * Xoá mềm đơn hàng
     */
    public function softDeleteOrder(Order $order): bool
    {
        return $this->repo->softDelete($order);
    }

    /**
     * Khôi phục đơn hàng đã xóa mềm
     */
    public function restoreOrder(Order $order): bool
    {
        return $this->repo->restoreOrder($order);
    }

    /**
     * Xoá vĩnh viễn đơn hàng
     */
    public function forceDeleteOrder(Order $order): bool
    {
        return $this->repo->forceDelete($order);
    }

    /**
     * Tìm đơn hàng kể cả đã xóa mềm
     */
    public function findOrderWithTrashed(int $id): ?Order
    {
        return $this->repo->findWithTrashed($id);
    }
}