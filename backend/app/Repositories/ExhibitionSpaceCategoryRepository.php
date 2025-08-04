<?php

namespace App\Repositories;

use App\Models\ExhibitionSpaceCategory;
use App\Interfaces\ExhibitionSpaceCategoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class ExhibitionSpaceCategoryRepository implements ExhibitionSpaceCategoryInterface
{
    public function getAll(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? $perPage;

        return ExhibitionSpaceCategory::query()
            ->when($filters['keyword'] ?? null, function (Builder $q, $kw) {
                $kw = addcslashes($kw, '%_');
                $q->where(function (Builder $sub) use ($kw) {
                    $sub->where('name', 'like', "%$kw%")
                        ->orWhere('description', 'like', "%$kw%");
                });
            })
            ->when(
                isset($filters['sort_by']) && isset($filters['sort_order']),
                fn(Builder $q) => $q->orderBy($filters['sort_by'], $filters['sort_order'])
            )
            ->paginate($perPage);
    }



    public function getTree()
    {
        return ExhibitionSpaceCategory::with('children')->whereNull('parent_id')->get();
    }


    public function findById(int $id): ?ExhibitionSpaceCategory
    {
        return ExhibitionSpaceCategory::find($id);
    }

    public function create(array $data): ExhibitionSpaceCategory
    {
        return ExhibitionSpaceCategory::create($data);
    }

    public function update(ExhibitionSpaceCategory $category, array $data): ExhibitionSpaceCategory
    {
        $category->update($data);
        return $category;
    }

    public function delete(ExhibitionSpaceCategory $category): bool
    {
        return $category->delete();
    }
}