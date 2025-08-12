<?php

namespace App\Policies;

use App\Models\User;
use App\Models\RentalContract;
use App\Enums\UserRole;
use App\Policies\BasePolicy;

class RentalContractPolicy extends BasePolicy
{
    protected function isEnterpriseUser(User $user): bool
    {
        return UserRole::requiresEnterpriseProfile($user->role);
    }

    // Kế thừa BasePolicy, có thể dùng enterpriseApprovedAndOwns để check owner + hồ sơ duyệt
    protected function isOwner(User $user, RentalContract $contract): bool
    {
        return $user->real_enterprise_id !== null
            && $user->real_enterprise_id === $contract->enterprise_id;
    }

    public function view(User $user, RentalContract $contract): bool
    {
        // System user có quyền xem tất cả
        if (UserRole::isSystem($user->role)) {
            return true;
        }

        // Doanh nghiệp được xem nếu là chủ hợp đồng
        return $this->enterpriseOwnsResource($user, $contract);
    }

    public function viewAny(User $user): bool
    {
        return UserRole::isSystem($user->role) || $this->isEnterpriseUser($user);
    }

    public function createOffline(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }

    public function create(User $user): bool
    {
        // Tạo hợp đồng chỉ DN đã duyệt mới được phép
        return $this->isEnterpriseUser($user) && $user->hasApprovedProfile();
    }

    public function delete(User $user, RentalContract $contract): bool
    {
        if (UserRole::isSystem($user->role)) {
            return true;
        }

        // Chỉ DN đã duyệt và chủ hợp đồng mới xóa được
        return $this->enterpriseApprovedAndOwns($user, $contract);
    }

    public function approve(User $user, RentalContract $contract): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }

    public function cancel(User $user, RentalContract $contract): bool
    {
        // Chỉ DN đã duyệt và chủ hợp đồng mới hủy được
        return $this->enterpriseApprovedAndOwns($user, $contract);
    }

    public function extend(User $user, RentalContract $contract): bool
    {
        // Chỉ DN đã duyệt và chủ hợp đồng mới gia hạn được
        return $this->enterpriseApprovedAndOwns($user, $contract);
    }

    public function reject(User $user, RentalContract $contract): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC]);
    }
}