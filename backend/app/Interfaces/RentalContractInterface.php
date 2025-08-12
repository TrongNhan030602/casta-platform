<?php
namespace App\Interfaces;

use App\Models\RentalContract;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface RentalContractInterface
{
    public function getRentalContracts(array $filters): LengthAwarePaginator;
    public function findOrFail(int $id): RentalContract;

    public function createByAdmin(array $data): RentalContract;
    public function create(array $data): RentalContract;
    public function approve(RentalContract $contract, int $reviewerId): RentalContract;
    public function reject(RentalContract $contract, int $reviewerId, string $reason): RentalContract;
    public function approveExtension(RentalContract $contract, string $newEndDate, int $reviewerId): RentalContract;
    public function rejectExtension(RentalContract $contract, string $reason, int $reviewerId): RentalContract;

    public function requestCancel(RentalContract $contract, ?string $reason = null): RentalContract;
    public function requestExtend(RentalContract $contract): RentalContract;
    public function getActiveContracts(): LengthAwarePaginator;
    public function getMyContracts(int $enterpriseId): LengthAwarePaginator;

    public function delete(RentalContract $contract): bool;
}