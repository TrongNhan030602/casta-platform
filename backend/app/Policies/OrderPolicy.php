<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Order;

class OrderPolicy extends BasePolicy
{
    /**
     * Xem danh sách đơn hàng
     */
    public function viewAny(User $user): bool
    {
        // System user, Enterprise, Customer đều có quyền xem danh sách
        return $user->isSystemUser() || $user->isEnterprise() || $user->isCustomer();
    }

    /**
     * Xem chi tiết đơn hàng
     */
    public function view(User $user, Order $order): bool
    {
        if ($user->isSystemUser()) {
            return true; // Admin xem tất cả
        }

        if ($user->isEnterprise()) {
            // Enterprise chỉ xem nếu có ít nhất 1 sub_order thuộc doanh nghiệp của họ
            return $order->subOrders->contains(fn($sub) => $sub->enterprise_id === $user->real_enterprise_id);
        }

        if ($user->isCustomer()) {
            // Customer chỉ xem đơn của mình
            return $order->customer_id === $user->customer?->id;
        }

        return false;
    }

    /**
     * Tạo đơn hàng
     */
    public function create(User $user): bool
    {

        return $user->isCustomer();
    }

    /**
     * Tạo transaction cho đơn hàng
     */
    public function createTransaction(User $user, Order $order, ?int $subOrderId = null): bool
    {
        if ($user->isSystemUser()) {
            return true; // Admin được phép tất cả
        }

        if ($user->isEnterprise()) {
            if ($subOrderId) {
                // Enterprise chỉ được tạo transaction cho sub_order thuộc mình
                return $order->subOrders->contains(fn($sub) => $sub->id === $subOrderId && $sub->enterprise_id === $user->real_enterprise_id);
            }
            // Nếu không chỉ định sub_order, không cho phép
            return false;
        }

        if ($user->isCustomer()) {
            // Customer chỉ tạo transaction cho đơn của mình
            return $order->customer_id === $user->customer?->id;
        }

        return false;
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    public function updateStatus(User $user, Order $order): bool
    {
        if ($user->isSystemUser()) {
            return true; // Admin có quyền cập nhật tất cả
        }

        if ($user->isEnterprise()) {
            // Enterprise chỉ thao tác trên đơn có sub_order của mình
            return $order->subOrders->contains(fn($sub) => $sub->enterprise_id === $user->real_enterprise_id);
        }

        if ($user->isCustomer()) {
            // Customer chỉ thao tác trên đơn của mình
            return $order->customer_id === $user->customer?->id;
        }

        return false;
    }

    /**
     * Xoá đơn hàng (admin)
     */
    public function adminDelete(User $user, Order $order): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Duyệt / approve đơn hàng (admin)
     */
    public function approve(User $user, Order $order): bool
    {
        return $user->isSystemUser();
    }
}