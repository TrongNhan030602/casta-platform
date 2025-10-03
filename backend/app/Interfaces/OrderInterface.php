<?php
namespace App\Interfaces;

use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface OrderInterface
{
    /**
     * Tạo một đơn hàng kèm sub_orders + order_items
     */
    public function storeOrder(array $data): Order;
    public function storeTransaction(Order $order, array $data, ?int $subOrderId = null): Transaction;
    /**
     * Lấy chi tiết đơn hàng theo id, bao gồm sub_orders, items, transactions, status history
     */
    public function getById(int $orderId): ?Order;

    /**
     * Lấy danh sách đơn hàng phân trang, có filter
     */
    public function listOrders(array $filters): LengthAwarePaginator;

    /**
     * Cập nhật trạng thái đơn hàng
     */
    public function updateStatus(Order $order, string|\App\Enums\OrderStatus $newStatus, ?int $changedBy = null): Order;

    /**
     * Xoá mềm đơn hàng
     */
    public function softDelete(Order $order): bool;

    /**
     * Khôi phục đơn hàng đã xoá
     */
    public function restoreOrder(Order $order): bool;

    /**
     * Xoá vĩnh viễn đơn hàng
     */
    public function forceDelete(Order $order): bool;

    /**
     * Tìm đơn hàng kể cả đã xoá mềm
     */
    public function findWithTrashed(int $id): ?Order;
}