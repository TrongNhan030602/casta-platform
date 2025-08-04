<?php
namespace App\Interfaces;

use App\Models\Violation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ViolationInterface
{
    public function create(array $data): Violation;

    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getByUserId(int $userId): array;
    public function countByUserId(int $userId): int;

    public function delete(int $id): bool;

}