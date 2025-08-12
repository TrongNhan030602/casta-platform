<?php
namespace App\Policies;

use App\Models\User;

class BasePolicy
{
    protected function enterpriseOwnsResource(User $user, $resource): bool
    {
        return $user->isEnterprise() && $resource->enterprise_id === $user->real_enterprise_id;
    }

    protected function enterpriseApprovedAndOwns(User $user, $resource): bool
    {
        return $this->enterpriseOwnsResource($user, $resource) && $user->hasApprovedProfile();
    }
}