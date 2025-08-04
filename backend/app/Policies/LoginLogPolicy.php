<?php

namespace App\Policies;

use App\Models\User;
use App\Models\LoginLog;
use App\Enums\UserRole;

class LoginLogPolicy
{
    public function delete(User $currentUser, LoginLog $log): bool
    {
        $logUser = $log->user;

        // Tránh lỗi nếu log không có user
        if (!$logUser) {
            return false;
        }

        $isPrivileged = in_array($currentUser->role, [UserRole::ADMIN, UserRole::CVCC]);
        $isNotSelf = $currentUser->id !== $logUser->id;
        $isLowerTarget = $currentUser->role->canManage($logUser->role);

        \Log::info('DEBUG LoginLogPolicy@delete', [
            'current_id' => $currentUser->id,
            'current_role' => $currentUser->role->value,
            'log_user_id' => $logUser->id,
            'log_user_role' => $logUser->role->value,
            'isPrivileged' => $isPrivileged,
            'isNotSelf' => $isNotSelf,
            'isLowerTarget' => $isLowerTarget,
        ]);

        return $isPrivileged && $isNotSelf && $isLowerTarget;
    }
}