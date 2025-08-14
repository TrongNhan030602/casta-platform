<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Service;

class ServicePolicy
{
    /**
     * Ai được phép xem danh sách dịch vụ (index).
     */
    public function viewAny(User $user): bool
    {
        return $user->isSystemUser(); // admin / editor
    }

    /**
     * Ai được phép xem chi tiết dịch vụ.
     * Dịch vụ public thì ai cũng xem được,
     * draft/archived chỉ admin hoặc người tạo.
     */
    public function view(User $user, Service $service): bool
    {
        if ($service->isPublished()) {
            return true; // public
        }

        if ($user->isSystemUser()) {
            return true; // admin
        }

        return $service->created_by === $user->id; // creator
    }

    /**
     * Ai được phép tạo dịch vụ.
     */
    public function create(User $user): bool
    {
        return $user->isSystemUser(); // admin / editor
    }

    /**
     * Ai được phép cập nhật dịch vụ.
     */
    public function update(User $user, Service $service): bool
    {
        if ($user->isSystemUser()) {
            return true;
        }

        return $service->created_by === $user->id;
    }

    /**
     * Ai được phép xóa (soft delete) dịch vụ.
     */
    public function delete(User $user, Service $service): bool
    {
        if ($user->isSystemUser()) {
            return true;
        }

        return $service->created_by === $user->id;
    }

    /**
     * Ai được phép khôi phục dịch vụ đã xóa mềm.
     */
    public function restore(User $user, Service $service): bool
    {
        return $user->isSystemUser();
    }

    /**
     * Ai được phép xóa vĩnh viễn dịch vụ.
     */
    public function forceDelete(User $user, Service $service): bool
    {
        return $user->isSystemUser();
    }
}