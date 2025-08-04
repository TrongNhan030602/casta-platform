<?php
namespace App\Policies;

use App\Models\User;
use App\Models\Category;
use App\Enums\UserRole;

class CategoryPolicy
{
    public function viewAny(User $user): bool
    {
        return UserRole::isSystem($user->role) || in_array($user->role, UserRole::enterpriseRoles());
    }


    public function view(User $user, Category $category): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::ADMIN;
    }

    public function update(User $user, Category $category): bool
    {
        return $user->role === UserRole::ADMIN;
    }

    public function delete(User $user, Category $category): bool
    {
        return $user->role === UserRole::ADMIN;
    }
}