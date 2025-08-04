<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ExhibitionSpaceCategory;
use App\Enums\UserRole;

class ExhibitionSpaceCategoryPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }


    public function view(User $user, ExhibitionSpaceCategory $category): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::ADMIN;
    }

    public function update(User $user, ExhibitionSpaceCategory $category): bool
    {
        return $user->role === UserRole::ADMIN;
    }

    public function delete(User $user, ExhibitionSpaceCategory $category): bool
    {
        return $user->role === UserRole::ADMIN;
    }
}