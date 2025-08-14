<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Media;

class MediaPolicy
{
    /**
     * Ai được phép xem danh sách Media (index).
     * Thường là admin hoặc user hệ thống.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ai được phép xem chi tiết Media.
     * Media công khai thì ai cũng xem được,
     * Media riêng tư thì chỉ admin hoặc người upload mới xem được.
     */
    public function view(User $user, Media $media): bool
    {
        if ($media->is_public ?? false) { // nếu có flag public
            return true;
        }

        if ($user->isSystemUser()) {
            return true; // Admin xem được tất cả
        }

        // Người upload có thể xem media của mình
        return $media->uploaded_by === $user->id;
    }

    /**
     * Ai được phép tạo/upload Media.
     * Thường là admin hoặc user hệ thống.
     */
    public function create(User $user): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ai được phép cập nhật Media.
     * Admin được cập nhật tất cả,
     * người upload chỉ được cập nhật media của mình.
     */
    public function update(User $user, Media $media): bool
    {
        if ($user->isSystemUser()) {
            return true;
        }

        return $media->uploaded_by === $user->id;
    }

    /**
     * Ai được phép xóa (soft delete) Media.
     * Admin hoặc người upload.
     */
    public function delete(User $user, Media $media): bool
    {
        if ($user->isSystemUser()) {
            return true;
        }

        return $media->uploaded_by === $user->id;
    }

    /**
     * Ai được phép khôi phục Media đã xóa mềm.
     * Chỉ admin được phép.
     */
    public function restore(User $user, Media $media): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ai được phép xóa vĩnh viễn Media.
     * Chỉ admin được phép.
     */
    public function forceDelete(User $user, Media $media): bool
    {
        return $user->isSystemUser();
    }
}