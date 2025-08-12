<?php

namespace App\Repositories;

use App\Models\Enterprise;
use App\Enums\EnterpriseStatus;
use App\Interfaces\EnterpriseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EnterpriseRepository implements EnterpriseRepositoryInterface
{
    public function getAll(array $filters): LengthAwarePaginator
    {
        $query = Enterprise::query();

        if (!empty($filters['status'])) {
            $status = EnterpriseStatus::tryFrom($filters['status']);
            if ($status) {
                $query->where('status', $status); // ✅ không cần ->value
            }
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('company_name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('tax_code', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('representative', 'like', '%' . $filters['search'] . '%');
                ;
            });
        }
        if (!empty($filters['sort_by']) && !empty($filters['sort_order'])) {
            $query->orderBy($filters['sort_by'], $filters['sort_order']);
        }

        return $query->with(['user', 'publicContract'])->paginate($filters['per_page'] ?? 15);

    }

    public function findById(int $id): ?Enterprise
    {
        return Enterprise::with(['user', 'reviewer'])->find($id);
    }

    public function create(array $data): Enterprise
    {
        return Enterprise::create($data);
    }

    public function update(Enterprise $enterprise, array $data): bool
    {
        return $enterprise->update($data);
    }



    public function approve(Enterprise $enterprise, int $reviewedBy): bool
    {
        return $enterprise->update([
            'status' => EnterpriseStatus::APPROVED, // ✅ Enum trực tiếp
            'reviewed_by' => $reviewedBy,
            'approved_at' => now(),
        ]);
    }

    public function reject(Enterprise $enterprise, int $reviewedBy): bool
    {
        return $enterprise->update([
            'status' => EnterpriseStatus::REJECTED,
            'reviewed_by' => $reviewedBy,
        ]);
    }

    public function suspend(Enterprise $enterprise): bool
    {
        return $enterprise->update([
            'status' => EnterpriseStatus::SUSPENDED,
        ]);
    }

    public function resume(Enterprise $enterprise): bool
    {
        return $enterprise->update([
            'status' => EnterpriseStatus::APPROVED,
        ]);
    }

    public function getSimpleList(?string $keyword = null, int $limit = 100)
    {
        $query = Enterprise::query()
            ->select('id', 'company_name')
            ->where('status', EnterpriseStatus::APPROVED->value) // Lọc doanh nghiệp đã duyệt
            ->orderBy('company_name');

        if ($keyword) {
            $query->where('company_name', 'like', '%' . $keyword . '%');
        }

        return $query->limit($limit)->get();
    }

}