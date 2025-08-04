<?php
namespace App\Interfaces;

use App\Models\User;
use App\Enums\UserStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserInterface
{
    public function create(array $data): User;

    public function findById(int $id): ?User;

    public function update(User $user, array $data): User;
    public function updateStatus(User $user, UserStatus $status): User;

    public function getLoginLogs(int $userId, int $perPage = 15): LengthAwarePaginator;
    public function deleteLoginLog(int $logId): bool;

    public function getAll(array $filters, int $perPage = 15): LengthAwarePaginator;

    public function requestReactivation(User $user): bool;
    /**
     * Kiểm tra dữ liệu liên quan đến tài khoản trước khi xóa
     * Trả về mảng thông tin cảnh báo nếu có, rỗng nếu không có gì
     */
    public function checkRelatedDataBeforeDelete(int $userId): array;

    /**
     * Xóa tài khoản và các dữ liệu liên quan (nếu được phép)
     */
    public function deleteUser(User $user): bool;
}