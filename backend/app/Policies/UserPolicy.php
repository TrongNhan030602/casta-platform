<?php
namespace App\Policies;

use App\Models\User;
use App\Enums\UserRole;
use App\Enums\UserStatus;

class UserPolicy
{
    private function notSelf(User $current, User $target): bool
    {
        return $current->id !== $target->id;
    }

    private function canManage(User $current, User $target): bool
    {
        return $this->notSelf($current, $target)
            && $current->role->canManage($target->role);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }

    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }

    public function view(User $currentUser, User $targetUser): bool
    {
        if ($currentUser->id === $targetUser->id) {
            return true;
        }

        if ($currentUser->role === UserRole::ADMIN) {
            return true;
        }

        return in_array($currentUser->role, [UserRole::CVCC, UserRole::CVQL])
            && in_array($targetUser->role, [UserRole::KH, UserRole::DN, UserRole::NVDN]);
    }

    public function update(User $currentUser, User $targetUser): bool
    {
        if (!$this->notSelf($currentUser, $targetUser)) {
            return false;
        }

        return $currentUser->role === UserRole::ADMIN
            || $currentUser->role === UserRole::CVCC
            && in_array($targetUser->role, [UserRole::KH, UserRole::DN, UserRole::NVDN]);
    }

    public function changeRole(User $currentUser, User $targetUser, string $newRole): bool
    {
        $new = UserRole::tryFrom($newRole);
        if (!$new || !$this->notSelf($currentUser, $targetUser)) {
            return false;
        }

        if ($currentUser->role === UserRole::ADMIN) {
            return true;
        }

        return $currentUser->role === UserRole::CVCC
            && $currentUser->role->canManage($new);
    }

    public function updateStatus(User $currentUser, User $targetUser): bool
    {
        return $this->canManage($currentUser, $targetUser)
            && in_array($currentUser->role, [UserRole::ADMIN, UserRole::CVCC]);
    }

    public function review(User $currentUser, User $targetUser): bool
    {
        return in_array($currentUser->role, [UserRole::ADMIN, UserRole::CVCC, UserRole::CVQL])
            && $targetUser->role === UserRole::DN
            && $targetUser->status === UserStatus::PENDING;
    }

    public function viewLoginLogs(User $currentUser, User $targetUser): bool
    {
        if ($currentUser->id === $targetUser->id || $currentUser->role === UserRole::ADMIN) {
            return true;
        }

        return in_array($currentUser->role, [UserRole::CVCC, UserRole::CVQL])
            && in_array($targetUser->role, [UserRole::KH, UserRole::DN, UserRole::NVDN]);
    }
    public function deleteLoginLog(User $currentUser, User $logUser): bool
    {
        // Chỉ cho phép ADMIN hoặc CVCC
        $isPrivileged = in_array($currentUser->role, [UserRole::ADMIN, UserRole::CVCC]);
        $isNotSelf = $currentUser->id !== $logUser->id;
        $isLowerTarget = $currentUser->role->canManage($logUser->role);

        return $isPrivileged && $isNotSelf && $isLowerTarget;
    }



    public function delete(User $currentUser, User $targetUser): bool
    {
        return $currentUser->role === UserRole::ADMIN
            || ($currentUser->role === UserRole::CVCC
                && in_array($targetUser->role, [UserRole::KH, UserRole::DN, UserRole::NVDN]));
    }
}