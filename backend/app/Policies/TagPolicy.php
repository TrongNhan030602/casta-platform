<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Tag;

class TagPolicy
{
    /**
     * Xem danh sách tag.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSystemUser(); // admin / editor
    }

    /**
     * Xem chi tiết tag.
     */
    public function view(User $user, Tag $tag): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Tạo tag.
     */
    public function create(User $user): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Cập nhật tag.
     */
    public function update(User $user, Tag $tag): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Xóa mềm tag.
     */
    public function delete(User $user, Tag $tag): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Khôi phục tag đã xóa mềm.
     */
    public function restore(User $user, Tag $tag): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Xóa vĩnh viễn tag.
     */
    public function forceDelete(User $user, Tag $tag): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Gắn tag vào model khác.
     */
    public function attach(User $user, string $modelClass, $model): bool
    {
        // authorize quyền update model đích
        return $user->can('update', $model);
    }

    /**
     * Gỡ tag khỏi model khác.
     */
    public function detach(User $user, string $modelClass, $model): bool
    {
        // authorize quyền update model đích
        return $user->can('update', $model);
    }
}