<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Post;

class PostPolicy
{
    /**
     * Ai được phép xem danh sách bài viết (index).
     * Thường là admin hoặc user hệ thống.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ai được phép xem chi tiết bài viết.
     * Bài public (published) thì ai cũng xem được,
     * còn draft, archived thì chỉ admin hoặc tác giả mới xem được.
     */
    public function view(User $user, Post $post): bool
    {
        if ($post->isPublished()) {
            return true; // Bài public xem được tất cả
        }

        if ($user->isSystemUser()) {
            return true; // Admin xem được tất cả
        }

        // Tác giả có thể xem bài chưa public của mình
        return $post->author_id === $user->id;
    }

    /**
     * Ai được phép tạo bài viết.
     * Thường là admin hoặc editor (user hệ thống).
     */
    public function create(User $user): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ai được phép cập nhật bài viết.
     * Admin được cập nhật tất cả,
     * tác giả chỉ được cập nhật bài của mình.
     */
    public function update(User $user, Post $post): bool
    {
        if ($user->isSystemUser()) {
            return true;
        }

        return $post->author_id === $user->id;
    }

    /**
     * Ai được phép xóa (soft delete) bài viết.
     * Admin hoặc tác giả của bài.
     */
    public function delete(User $user, Post $post): bool
    {
        if ($user->isSystemUser()) {
            return true;
        }

        return $post->author_id === $user->id;
    }

    /**
     * Ai được phép khôi phục bài viết đã xóa mềm.
     * Chỉ admin được phép.
     */
    public function restore(User $user, Post $post): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ai được phép xóa vĩnh viễn bài viết.
     * Chỉ admin được phép.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        return $user->isSystemUser();
    }
}