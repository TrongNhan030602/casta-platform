<?php

namespace App\Policies;

use App\Models\User;
use App\Models\RentalContract;
use App\Enums\UserRole;
use App\Enums\RentalContractStatus;

class RentalContractPolicy
{
    protected function isEnterpriseUser(User $user): bool
    {
        return UserRole::requiresEnterpriseProfile($user->role);
    }

    protected function isOwner(User $user, RentalContract $contract): bool
    {
        return $user->real_enterprise_id !== null
            && $user->real_enterprise_id === $contract->enterprise_id;
    }


    public function view(User $user, RentalContract $contract): bool
    {
        return UserRole::isSystem($user->role)
            || ($this->isEnterpriseUser($user) && $this->isOwner($user, $contract));
    }

    public function viewAny(User $user): bool
    {
        return UserRole::isSystem($user->role)
            || $this->isEnterpriseUser($user);
    }

    public function create(User $user): bool
    {
        return $this->isEnterpriseUser($user);
    }
    public function delete(User $user, RentalContract $contract): bool
    {
        return UserRole::isSystem($user->role)
            || ($this->isEnterpriseUser($user) && $this->isOwner($user, $contract));
    }

    public function approve(User $user, RentalContract $contract): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }

    public function cancel(User $user, RentalContract $contract): bool
    {
        return $this->isEnterpriseUser($user)
            && $this->isOwner($user, $contract);
    }

    public function extend(User $user, RentalContract $contract): bool
    {
        return $this->isEnterpriseUser($user)
            && $this->isOwner($user, $contract);
    }

    public function reject(User $user, RentalContract $contract): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }

}