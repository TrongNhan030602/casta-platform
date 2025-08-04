<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Customer;
use App\Enums\UserRole;

class CustomerPolicy
{
    private function isOwner(User $user, Customer $customer): bool
    {
        return $user->id === $customer->user_id;
    }

    private function notSelf(User $user, Customer $customer): bool
    {
        return !$this->isOwner($user, $customer);
    }

    private function canManage(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }

    /**
     * ✅ Quyền xem thông tin khách hàng
     * - ADMIN, CSKH, CVCC, CVQL được xem toàn bộ
     * - KH chỉ được xem chính mình
     */
    public function view(User $user, Customer $customer): bool
    {
        return in_array($user->role, [
            UserRole::ADMIN,
            UserRole::CSKH,
            UserRole::CVCC,
            UserRole::CVQL,
        ]) || $this->isOwner($user, $customer);
    }

    /**
     * ✅ Quyền cập nhật thông tin khách hàng
     * - ADMIN và CVCC cập nhật được tất cả
     * - KH chỉ được cập nhật chính mình
     */
    public function update(User $user, Customer $customer): bool
    {
        return $this->canManage($user)
            || $this->isOwner($user, $customer);
    }

    /**
     * ✅ Quyền xóa khách hàng
     * - Chỉ ADMIN được xóa bất kỳ khách hàng nào
     */
    public function delete(User $user, Customer $customer): bool
    {
        return $user->role === UserRole::ADMIN;
    }

    /**
     * ✅ Quyền upload avatar
     * - ADMIN hoặc KH được cập nhật avatar của chính mình
     */
    public function uploadAvatar(User $user, Customer $customer): bool
    {
        return $user->role === UserRole::ADMIN
            || $this->isOwner($user, $customer);
    }

    /**
     * ✅ Quyền tạo khách hàng
     * - Chỉ ADMIN (hoặc hệ thống) có quyền tạo bản ghi khách hàng
     */
    public function create(User $user): bool
    {
        return $user->role === UserRole::ADMIN;
    }
}