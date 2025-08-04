<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Enums\UserRole;

class UserAuthResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Ép kiểu rõ ràng
        $user = $this->resource;

        $base = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
            'email_verified' => !is_null($user->email_verified_at),
            'created_at' => $user->created_at?->toDateTimeString(),
            'profile_type' => null,
            'profile_id' => null,
        ];

        try {
            $roleEnum = $user->role instanceof UserRole
                ? $user->role
                : UserRole::from($user->role);

            if ($roleEnum === UserRole::KH && $user->customer) {
                $base['profile_type'] = 'customer';
                $base['profile_id'] = $user->customer->id;
            }

            if (in_array($roleEnum, [UserRole::DN, UserRole::NVDN]) && $user->enterprise) {
                $base['profile_type'] = 'enterprise';
                $base['profile_id'] = $user->enterprise->id;
            }
        } catch (\Throwable $e) {
            // fallback nếu lỗi xảy ra
            $base['profile_type'] = null;
            $base['profile_id'] = null;
        }

        return $base;
    }
}