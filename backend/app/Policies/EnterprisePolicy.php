<?php
namespace App\Policies;

use App\Models\User;
use App\Models\Enterprise;
use App\Enums\UserRole;
use App\Enums\EnterpriseStatus;

class EnterprisePolicy
{
    /**
     * Helper: Ai có quyền xử lý doanh nghiệp (ADMIN, CVCC, CVQL)
     */
    private function canManageEnterprise(User $user): bool
    {
        return in_array($user->role, [
            UserRole::ADMIN,
            UserRole::CVCC,
            UserRole::CVQL,
        ]);
    }

    /**
     * ✅ Quyền duyệt hồ sơ doanh nghiệp
     * - ADMIN, CVCC, CVQL được duyệt
     * - Chỉ khi doanh nghiệp đang ở trạng thái PENDING
     */
    public function review(User $user, Enterprise $enterprise): bool
    {
        return $this->canManageEnterprise($user)
            && $enterprise->status === EnterpriseStatus::PENDING;
    }

    /**
     * ✅ Quyền từ chối hồ sơ doanh nghiệp
     * - ADMIN, CVCC, CVQL
     * - Chỉ khi trạng thái là PENDING
     */
    public function reject(User $user, Enterprise $enterprise): bool
    {
        return $this->canManageEnterprise($user)
            && $enterprise->status === EnterpriseStatus::PENDING;
    }

    /**
     * ✅ Quyền tạm ngưng doanh nghiệp
     * - Chỉ ADMIN, CVCC
     * - Chỉ khi doanh nghiệp đang ở trạng thái APPROVED
     */
    public function suspend(User $user, Enterprise $enterprise): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC])
            && $enterprise->status === EnterpriseStatus::APPROVED;
    }

    /**
     * ✅ Quyền mở lại hoạt động doanh nghiệp
     * - Chỉ ADMIN, CVCC
     * - Chỉ khi đang bị SUSPENDED
     */
    public function resume(User $user, Enterprise $enterprise): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::CVCC])
            && $enterprise->status === EnterpriseStatus::SUSPENDED;
    }

    /**
     * ✅ Quyền xem hồ sơ doanh nghiệp
     * - ADMIN, CVCC, CVQL xem tất cả
     * - DN chỉ được xem hồ sơ của mình
     */
    public function view(User $user, Enterprise $enterprise): bool
    {
        return $this->canManageEnterprise($user)
            || $user->id === $enterprise->user_id;
    }

    /**
     * ✅ Quyền cập nhật hồ sơ doanh nghiệp
     * - ADMIN được sửa toàn bộ
     * - DN chỉ được sửa hồ sơ của chính mình
     */
    public function update(User $user, Enterprise $enterprise): bool
    {
        return $user->role === UserRole::ADMIN
            || $user->id === $enterprise->user_id;
    }

    /**
     * ✅ Quyền xóa doanh nghiệp
     * - Chỉ ADMIN được phép xóa
     */
    public function delete(User $user, Enterprise $enterprise): bool
    {
        return $user->role === UserRole::ADMIN;
    }

    /**
     * ❌ Không cho phép doanh nghiệp tạo hồ sơ (vì đã được tạo khi duyệt tài khoản)
     */
    public function create(User $user): bool
    {
        return false;
    }
}