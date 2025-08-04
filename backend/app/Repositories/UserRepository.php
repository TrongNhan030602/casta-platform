<?php

namespace App\Repositories;

use App\Models\User;
use App\Enums\UserRole;
use App\Models\Customer;
use App\Models\LoginLog;
use App\Enums\UserStatus;
use App\Models\Enterprise;
use App\Enums\EnterpriseStatus;
use App\Interfaces\UserInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository implements UserInterface
{

    public function getAll(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return User::query()
            ->when($filters['role'] ?? null, fn(Builder $q, $role) => $q->where('role', $role))
            ->when($filters['status'] ?? null, fn(Builder $q, $status) => $q->where('status', $status))
            ->when($filters['keyword'] ?? null, function (Builder $q, $kw) {
                $kw = addcslashes($kw, '%_');
                $q->where(function (Builder $sub) use ($kw) {
                    $sub->where('name', 'like', "%$kw%")
                        ->orWhere('email', 'like', "%$kw%");
                });
            })
            ->when(
                isset($filters['sort_by']) && isset($filters['sort_order']),
                fn(Builder $q) => $q->orderBy($filters['sort_by'], $filters['sort_order'])
            )
            ->paginate($perPage);
    }

    public function findById(int $id): ?User
    {
        return User::with([
            'customer',
            'enterprise',
            'enterpriseBelongingTo',
            'loginLogs' => fn($q) => $q->latest(),
            'violations' => fn($q) => $q->latest(),
        ])->find($id);
    }

    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $data['password'] = Hash::make($data['password']);
            $data['status'] = UserStatus::ACTIVE;
            $data['role'] = $data['role'] ?? UserRole::KH;
            $data['email_verified_at'] = now();

            $role = UserRole::tryFrom($data['role']);

            if (!$role) {
                throw new \InvalidArgumentException('Vai trò không hợp lệ.');
            }

            if (UserRole::requiresEnterpriseId($role) && empty($data['enterprise_id'])) {
                throw new \InvalidArgumentException('Thiếu enterprise_id cho nhân viên doanh nghiệp.');
            }

            $user = User::create($data);

            if (UserRole::requiresCustomerProfile($role)) {
                Customer::firstOrCreate(['user_id' => $user->id], ['email' => $user->email]);
            }

            if ($role === UserRole::DN && !$user->enterprise) {
                Enterprise::create([
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'status' => EnterpriseStatus::PENDING,
                ]);
            }

            return $user;
        });
    }






    public function update(User $user, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);
        return $user->refresh();
    }
    public function updateStatus(User $user, UserStatus $status): User
    {
        $user->status = $status;
        $user->save();

        return $user;
    }



    public function getLoginLogs(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return LoginLog::where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }
    public function deleteLoginLog(int $logId): bool
    {
        $log = LoginLog::find($logId);

        if (!$log) {
            return false;
        }

        return $log->delete();
    }




    public function requestReactivation(User $user): bool
    {
        return $user->update([
            'reactivation_requested' => true,
            'reactivation_requested_at' => now(),
        ]);
    }
    public function checkRelatedDataBeforeDelete(int $userId): array
    {
        $warnings = [];

        // Kiểm tra doanh nghiệp nếu là DN
        $enterpriseCount = Enterprise::where('user_id', $userId)->count();
        if ($enterpriseCount > 0) {
            $warnings[] = "Tài khoản liên kết với doanh nghiệp đang hoạt động hoặc hồ sơ doanh nghiệp.";
        }

        // Kiểm tra khách hàng nếu là KH
        $customerCount = Customer::where('user_id', $userId)->count();
        if ($customerCount > 0) {
            $warnings[] = "Tài khoản liên kết với khách hàng.";
        }

        // Kiểm tra đơn hàng, hợp đồng, hoặc các dữ liệu quan trọng khác (ví dụ)
        // if (Order::where('user_id', $userId)->exists()) {
        //     $warnings[] = "Tài khoản có đơn hàng chưa xử lý.";
        // }

        // TODO: thêm các kiểm tra khác tùy hệ thống

        return $warnings;
    }

    public function deleteUser(User $user): bool
    {

        return DB::transaction(function () use ($user) {

            // Xóa các dữ liệu phụ thuộc nếu có thể
            // Ví dụ xóa hồ sơ khách hàng, doanh nghiệp liên quan
            if ($user->role === UserRole::KH) {
                Customer::where('user_id', $user->id)->delete();
            } elseif ($user->role === UserRole::DN) {
                Enterprise::where('user_id', $user->id)->delete();
            }

            // Xóa các dữ liệu liên quan khác nếu cần

            // Cuối cùng xóa user
            return $user->delete();
        });
    }
}