<?php
namespace App\Repositories;

use App\Models\Category;
use Illuminate\Support\Collection;
use App\Interfaces\CategoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CategoryRepository implements CategoryInterface
{
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        $query = Category::query()
            ->with('parent')
            ->when(request('keyword'), function ($q, $keyword) {
                $kw = addcslashes($keyword, '%_');
                $q->where(function ($subQ) use ($kw) {
                    $subQ->where('name', 'like', "%$kw%")
                        ->orWhere('description', 'like', "%$kw%");
                });
            })
            ->when(request()->filled('parent_id'), function ($q) {
                $q->where('parent_id', request('parent_id'));
            })
            ->when(request()->filled('is_active'), function ($q) {
                $q->where('is_active', request('is_active'));
            })
            ->when(
                request()->filled('sort_by') && request()->filled('sort_order'),
                fn($q) => $q->orderBy(request('sort_by'), request('sort_order')),
                fn($q) => $q->orderBy('sort_order')
            );

        return $query->paginate($perPage);
    }

    public function getTree(array $filters = []): Collection
    {
        return Category::with([
            'children' => function ($q) use ($filters) {
                if (isset($filters['is_active'])) {
                    $q->where('is_active', $filters['is_active']);
                }
            }
        ])
            ->whereNull('parent_id')
            ->when(isset($filters['is_active']), function ($q) use ($filters) {
                $q->where('is_active', $filters['is_active']);
            })
            ->orderBy('sort_order')
            ->get();
    }


    public function create(array $data): Category
    {
        return Category::create($data);
    }
    public function findById(int $id): Category
    {
        return Category::findOrFail($id);
    }

    public function update(Category $category, array $data): Category
    {
        $category->update($data);
        return $category;
    }

    public function delete(Category $category): bool
    {
        return $category->delete();
    }



}