<?php

namespace App\Policies;

use App\Models\User;
use App\Enums\UserRole;

class ViolationPolicy
{
    /**
     * Người dùng chỉ được cảnh báo người có cấp thấp hơn, không được tự cảnh báo mình.
     */
    public function warn(User $currentUser, User $targetUser): bool
    {
        return $currentUser->id !== $targetUser->id
            && in_array($currentUser->role, [UserRole::ADMIN, UserRole::CVCC])
            && $currentUser->role->canManage($targetUser->role);
    }

    /**
     * Chỉ ADMIN hoặc CVCC có quyền xóa, nhưng chỉ được xóa cảnh báo của người có cấp thấp hơn.
     */
    public function delete(User $currentUser, User $targetUser): bool
    {
        return in_array($currentUser->role, [UserRole::ADMIN, UserRole::CVCC])
            && $currentUser->role->canManage($targetUser->role);
    }
}