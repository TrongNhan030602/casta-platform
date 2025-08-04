<?php

namespace App\Services;

use App\Models\User;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Enterprise;
use App\Enums\EnterpriseStatus;
use App\Interfaces\UserInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReactivationRequestMail;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    protected UserInterface $userRepo;

    public function __construct(UserInterface $userRepo)
    {
        $this->userRepo = $userRepo;
    }
    public function getAllUsers(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepo->getAll($filters, $perPage);
    }
    public function getUserById(int $id): ?User
    {
        return $this->userRepo->findById($id);
    }

    public function createUser(array $data): User
    {
        return $this->userRepo->create($data);
    }
    public function updateUser(User $user, array $data): User
    {
        return $this->userRepo->update($user, $data);
    }
    public function updateUserStatus(User $user, UserStatus $status): User
    {
        return $this->userRepo->updateStatus($user, $status);
    }

    public function updateProfile(User $user, array $data): User
    {
        return $this->userRepo->update($user, $data);
    }
    public function getLoginLogs(User $targetUser, int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepo->getLoginLogs($targetUser->id, $perPage);
    }
    public function deleteLoginLog(int $logId): bool
    {
        return $this->userRepo->deleteLoginLog($logId);
    }

    /**
     * ✅ Logic duyệt tài khoản doanh nghiệp (Admin,CVCC/CVQL gọi)
     */
    public function reviewEnterprise(User $user, UserStatus $status): User
    {
        DB::beginTransaction();

        try {
            $updatedUser = $this->userRepo->updateStatus($user, $status);

            // Nếu duyệt DN thì tạo hồ sơ enterprise ở trạng thái PENDING
            if (
                $status === UserStatus::ACTIVE &&
                $user->role === UserRole::DN &&
                !$user->enterprise
            ) {
                Enterprise::create([
                    'user_id' => $user->id,
                    'company_name' => '',
                    'tax_code' => '',
                    'business_field' => '',
                    'district' => '',
                    'address' => '',
                    'representative' => '',
                    'phone' => $user->phone ?? '',
                    'email' => $user->email,
                    'status' => EnterpriseStatus::PENDING,
                ]);
            }

            DB::commit();
            return $updatedUser;
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }



    public function handleReactivationRequest(string $identifier, string $password): array
    {
        $user = User::where('email', $identifier)
            ->orWhere('name', $identifier)
            ->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return [
                'data' => ['message' => 'Thông tin xác thực không chính xác'],
                'status' => 401,
            ];
        }

        if ($user->status !== UserStatus::INACTIVE) {
            return [
                'data' => ['message' => 'Tài khoản không bị khóa. Không cần yêu cầu mở.'],
                'status' => 400,
            ];
        }

        // ✅ Chặn gửi lại nếu đã gửi trước đó
        if ($user->reactivation_requested) {
            return [
                'data' => ['message' => 'Bạn đã gửi yêu cầu rồi. Vui lòng chờ quản trị viên xử lý.'],
                'status' => 429,
            ];
        }

        $success = $this->userRepo->requestReactivation($user);

        if ($success) {
            Mail::to(config('mail.admin_email'))->send(new ReactivationRequestMail($user));
            return [
                'data' => ['message' => 'Yêu cầu mở khóa tài khoản đã được gửi đến quản trị viên.'],
                'status' => 200,
            ];
        }

        return [
            'data' => ['message' => 'Không thể xử lý yêu cầu vào lúc này.'],
            'status' => 500,
        ];
    }

    public function checkRelatedDataBeforeDelete(int $userId): array
    {
        return $this->userRepo->checkRelatedDataBeforeDelete($userId);
    }

    public function deleteUser(User $user): bool
    {
        return $this->userRepo->deleteUser($user);
    }
}