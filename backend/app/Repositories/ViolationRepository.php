<?php

namespace App\Repositories;

use App\Models\Violation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use App\Interfaces\ViolationInterface;

class ViolationRepository implements ViolationInterface
{
    public function create(array $data): Violation
    {
        return Violation::create($data);
    }

    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Violation::query()
            ->with('user')
            ->when($filters['keyword'] ?? null, function (Builder $q, $kw) {
                $kw = addcslashes($kw, '%_');
                $q->where(function (Builder $sub) use ($kw) {
                    $sub->whereHas('user', function (Builder $uq) use ($kw) {
                        $uq->where('name', 'like', "%$kw%")
                            ->orWhere('email', 'like', "%$kw%");
                    })
                        ->orWhere('reason', 'like', "%$kw%")
                        ->orWhere('details', 'like', "%$kw%");
                });
            })
            ->when(
                isset($filters['sort_by']) && isset($filters['sort_order']),
                fn(Builder $q) => $q->orderBy($filters['sort_by'], $filters['sort_order']),
                fn(Builder $q) => $q->orderByDesc('created_at') // mặc định sort mới nhất
            )
            ->paginate($perPage);
    }

    public function getByUserId(int $userId): array
    {
        return Violation::where('user_id', $userId)
            ->with('user')
            ->orderByDesc('created_at')
            ->get()
            ->all();
    }

    public function countByUserId(int $userId): int
    {
        return Violation::where('user_id', $userId)->count();
    }

    public function delete(int $id): bool
    {
        return Violation::destroy($id) > 0;
    }
}