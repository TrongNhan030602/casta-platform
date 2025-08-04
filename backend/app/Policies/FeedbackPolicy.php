<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Feedback;
use App\Enums\UserRole;

class FeedbackPolicy
{
    /**
     * Gửi phản hồi (mọi loại)
     */
    public function create(User $user): bool
    {
        return UserRole::requiresEnterpriseProfile($user->role)
            || UserRole::requiresCustomerProfile($user->role);
    }

    /**
     * Xem danh sách phản hồi (QTHT, CVQL, DN...)
     */
    public function viewAny(User $user): bool
    {
        return true; // Dùng filter để giới hạn dữ liệu hiển thị
    }

    /**
     * Xem chi tiết phản hồi
     */
    public function view(User $user, Feedback $feedback): bool
    {
        return $user->id === $feedback->user_id // người gửi
            || UserRole::isSystem($user->role)  // hệ thống
            || UserRole::requiresEnterpriseProfile($user->role); // DN, NVDN
    }

    /**
     * Phản hồi lại phản hồi
     */
    public function reply(User $user, Feedback $feedback): bool
    {
        // DN hoặc CVQL (hệ thống) được phản hồi lại
        return UserRole::isSystem($user->role)
            || UserRole::requiresEnterpriseProfile($user->role);
    }

    /**
     * Xóa phản hồi (chỉ hệ thống hoặc người gửi)
     */
    public function delete(User $user, Feedback $feedback): bool
    {
        return $user->id === $feedback->user_id
            || UserRole::isSystem($user->role);
    }
}