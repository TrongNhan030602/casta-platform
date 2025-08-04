<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ExhibitionMedia;
use App\Models\ExhibitionSpace;
use App\Enums\UserRole;

class ExhibitionMediaPolicy
{
    public function create(User $user, ExhibitionSpace $space): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC, UserRole::CVQL]);
    }

    public function update(User $user, ExhibitionMedia $media): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC, UserRole::CVQL]);
    }

    public function delete(User $user, ExhibitionMedia $media): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }
}