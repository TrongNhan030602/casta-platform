<?php

namespace App\Policies;

use App\Models\User;
use App\Enums\UserRole;
use App\Models\RentalContract;
use App\Models\ExhibitionSpaceProduct;

class ExhibitionSpaceProductPolicy
{
    public function create(User $user, RentalContract $contract): bool
    {
        return UserRole::requiresEnterpriseProfile($user->role)
            && $user->real_enterprise_id === $contract->enterprise_id;
    }

    public function viewAny(User $user, RentalContract $contract): bool
    {
        return $user->real_enterprise_id === $contract->enterprise_id;
    }

    public function update(User $user, ExhibitionSpaceProduct $product): bool
    {
        return $user->real_enterprise_id === $product->rentalContract->enterprise_id;
    }

    public function delete(User $user, ExhibitionSpaceProduct $product): bool
    {
        return $user->real_enterprise_id === $product->rentalContract->enterprise_id;
    }

    public function approve(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }
}