<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Order;
use App\Enums\UserRole;
use App\Enums\OrderStatus;

class OrderPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        // System user hoặc enterprise đều có thể xem danh sách đơn hàng
        return $user->isSystemUser() || $user->isEnterprise() || $user->isCustomer();
    }

    public function view(User $user, Order $order): bool
    {
        if ($user->isSystemUser()) {
            return true;
        }

        if ($user->isEnterprise()) {
            // Nếu muốn ràng buộc DN thì có thể check enterprise_id giữa user và order
            return true;
        }

        if ($user->isCustomer()) {
            return $order->customer_id === $user->customer?->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        // Chỉ khách hàng mới được tạo đơn hàng
        return $user->isCustomer();
    }

    public function updateStatus(User $user, Order $order): bool
    {
        if ($user->isSystemUser() || $user->isEnterprise()) {
            return true;
        }

        if ($user->isCustomer()) {
            // Khách chỉ được hủy đơn của mình khi còn pending/processing
            return $order->customer_id === $user->customer?->id
                && in_array($order->status, [OrderStatus::PENDING, OrderStatus::PROCESSING]);
        }

        return false;
    }

    // ========== Các action đặc thù hệ thống (admin, duyệt/hủy) ==============
    public function adminDelete(User $user, Order $order): bool
    {
        return $user->isSystemUser();
    }

    public function approve(User $user, Order $order): bool
    {
        return $user->isSystemUser();
    }
}