<?php
namespace App\Policies;

use App\Models\User;
use App\Models\Product;

class ProductPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isEnterprise() || $user->isSystemUser();
    }


    public function view(User $user, Product $product): bool
    {
        return (
            $user->isEnterprise() && $product->enterprise_id === $user->real_enterprise_id
        ) || $user->isSystemUser();
    }


    public function create(User $user): bool
    {
        return $user->isEnterprise();
    }
    public function submit(User $user, Product $product): bool
    {
        return $user->isEnterprise()
            && $product->enterprise_id === $user->real_enterprise_id;
    }

    public function update(User $user, Product $product): bool
    {
        return $user->isEnterprise()
            && $product->enterprise_id === $user->real_enterprise_id;
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->isEnterprise() && $product->enterprise_id === $user->real_enterprise_id;
    }
    public function updateImage(User $user, Product $product): bool
    {
        // Cho phép doanh nghiệp chính hoặc nhân viên DN chỉnh sửa ảnh
        if ($user->isEnterprise() && $product->enterprise_id === $user->real_enterprise_id) {
            return true;
        }

        // Cho phép admin (QTHT) chỉnh sửa ảnh sản phẩm
        if ($user->isSystemUser()) {
            return true;
        }

        return false;
    }

    public function adminDelete(User $user, Product $product): bool
    {
        return $user->isSystemUser();
    }


    public function approve(User $user, Product $product): bool
    {
        return $user->isSystemUser(); // Chỉ QTHT có quyền duyệt
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
        return (
            $user->isEnterprise() && $product->enterprise_id === $user->real_enterprise_id
        ) || $user->isSystemUser();
    }
    public function viewStockLogs(User $user, Product $product): bool
    {
        return $this->view($user, $product); // Dùng lại logic có sẵn
    }



}