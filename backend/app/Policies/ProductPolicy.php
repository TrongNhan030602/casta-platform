<?php
namespace App\Policies;

use App\Models\User;
use App\Models\Product;

class ProductPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isEnterprise() || $user->isSystemUser();
    }

    public function view(User $user, Product $product): bool
    {
        return $this->enterpriseOwnsResource($user, $product) || $user->isSystemUser();
    }

    public function create(User $user): bool
    {

        return $user->isEnterprise() && $user->hasApprovedProfile();
    }

    public function submit(User $user, Product $product): bool
    {
        return $this->enterpriseApprovedAndOwns($user, $product);
    }

    public function update(User $user, Product $product): bool
    {
        return $this->enterpriseApprovedAndOwns($user, $product);
    }

    public function delete(User $user, Product $product): bool
    {
        return $this->enterpriseApprovedAndOwns($user, $product);
    }

    public function updateImage(User $user, Product $product): bool
    {
        return $this->enterpriseOwnsResource($user, $product) || $user->isSystemUser();
    }

    public function adminDelete(User $user, Product $product): bool
    {
        return $user->isSystemUser();
    }

    public function approve(User $user, Product $product): bool
    {
        return $user->isSystemUser();
    }

    public function adminStore(User $user): bool
    {
        return $user->isSystemUser();
    }

    public function adminUpdate(User $user, Product $product): bool
    {
        return $user->isSystemUser();
    }

    public function adjustStock(User $user, Product $product): bool
    {
        return $this->enterpriseOwnsResource($user, $product) || $user->isSystemUser();
    }

    public function viewStockLogs(User $user, Product $product): bool
    {
        return $this->view($user, $product);
    }
}