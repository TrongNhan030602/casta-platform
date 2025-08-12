<?php

namespace App\Policies;

use App\Models\User;
use App\Models\RentalContract;
use App\Models\ExhibitionSpaceProduct;
use App\Enums\UserRole;

class ExhibitionSpaceProductPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }

    public function viewAnyByContract(User $user, RentalContract $contract): bool
    {
        return UserRole::requiresEnterpriseProfile($user->role)
            && $this->enterpriseOwnsResource($user, $contract);
    }

    public function view(User $user, ExhibitionSpaceProduct $product): bool
    {
        return $this->enterpriseOwnsResource($user, $product->rentalContract);
    }

    public function create(User $user, RentalContract $contract): bool
    {
        return UserRole::requiresEnterpriseProfile($user->role)
            && $this->enterpriseApprovedAndOwns($user, $contract);
    }

    public function update(User $user, ExhibitionSpaceProduct $product): bool
    {
        return $this->enterpriseApprovedAndOwns($user, $product->rentalContract);
    }

    public function delete(User $user, ExhibitionSpaceProduct $product): bool
    {
        if (in_array($user->role, [UserRole::ADMIN, UserRole::CVCC])) {
            return true;
        }

        return $this->enterpriseApprovedAndOwns($user, $product->rentalContract);
    }

    public function approve(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }
}