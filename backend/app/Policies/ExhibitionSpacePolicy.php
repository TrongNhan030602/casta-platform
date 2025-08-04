<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ExhibitionSpace;
use App\Enums\UserRole;

class ExhibitionSpacePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            UserRole::ADMIN,
            UserRole::CVCC,
            UserRole::CVQL,
            UserRole::QLGH,
        ]);
    }

    public function view(User $user, ExhibitionSpace $space): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::ADMIN;
    }

    public function update(User $user, ExhibitionSpace $space): bool
    {
        return $user->role === UserRole::ADMIN;
    }

    public function changeStatus(User $user, ExhibitionSpace $space): bool
    {
        return $user->role === UserRole::ADMIN;
    }

    public function delete(User $user, ExhibitionSpace $space): bool
    {
        return $user->role === UserRole::ADMIN;
    }

    // ✅ Nếu sau này có xử lý phản hồi, góp ý từ doanh nghiệp
    public function manageFeedback(User $user): bool
    {
        return $user->role === UserRole::ADMIN;
    }
}