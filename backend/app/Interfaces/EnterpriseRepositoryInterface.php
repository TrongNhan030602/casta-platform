<?php

namespace App\Interfaces;

use App\Models\Enterprise;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;


interface EnterpriseRepositoryInterface
{
    public function getAll(array $filters): LengthAwarePaginator;

    public function findById(int $id): ?Enterprise;

    public function create(array $data): Enterprise;

    public function update(Enterprise $enterprise, array $data): bool;


    public function approve(Enterprise $enterprise, int $reviewedBy): bool;

    public function reject(Enterprise $enterprise, int $reviewedBy): bool;

    public function suspend(Enterprise $enterprise): bool;
    public function resume(Enterprise $enterprise): bool;
    public function getSimpleList(?string $keyword = null, int $limit = 100);
}