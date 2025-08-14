<?php

namespace App\Policies;

use App\Models\User;
use App\Models\NewsCategory;

class NewsCategoryPolicy extends BasePolicy
{
    /**
     * Ai được phép xem danh sách danh mục (index).
     * Thường là admin hoặc user hệ thống.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ai được phép xem chi tiết danh mục.
     * Có thể mở rộng nếu cần phân quyền theo doanh nghiệp hoặc nhóm.
     */
    public function view(User $user, NewsCategory $category): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ai được phép tạo danh mục mới.
     * Chỉ admin hoặc hệ thống quản lý.
     */
    public function create(User $user): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ai được phép cập nhật danh mục.
     * Có thể thêm điều kiện bổ sung nếu cần.
     */
    public function update(User $user, NewsCategory $category): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ai được phép xóa (soft delete) danh mục.
     */
    public function delete(User $user, NewsCategory $category): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ví dụ mở rộng, nếu bạn có restore hoặc forceDelete:
     */
    public function restore(User $user, NewsCategory $category): bool
    {
        return $user->isSystemUser();
    }

    public function forceDelete(User $user, NewsCategory $category): bool
    {
        return $user->isSystemUser();
    }
}