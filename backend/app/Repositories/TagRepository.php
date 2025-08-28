<?php

namespace App\Repositories;

use App\Models\Tag;
use App\Interfaces\TagInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TagRepository implements TagInterface
{
    /**
     * Lấy danh sách tags có filter, sort, soft delete
     */

    public function list(array $filters = [], bool $withTrashed = false, bool $onlyTrashed = false): LengthAwarePaginator
    {
        $query = Tag::query();

        // Soft delete
        if ($onlyTrashed) {
            $query->onlyTrashed();
        } elseif ($withTrashed) {
            $query->withTrashed();
        }

        // Keyword search
        if (!empty($filters['q'])) {
            $q = $filters['q'];
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('slug', 'like', "%{$q}%");
            });
        }

        // Sort
        $validSortBy = ['id', 'name', 'slug'];
        $sortBy = in_array($filters['sort_by'] ?? '', $validSortBy) ? $filters['sort_by'] : 'id';
        $sortOrder = strtolower($filters['sort_order'] ?? '') === 'desc' ? 'desc' : 'asc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = (int) ($filters['per_page'] ?? 15);

        // ✅ Trả LengthAwarePaginator tuyệt đối
        return $query->paginate($perPage);
    }


    public function find(int $id, bool $withTrashed = false): Tag
    {
        $query = Tag::query();

        if ($withTrashed) {
            $query->withTrashed();
        }

        return $query->findOrFail($id);
    }

    public function store(array $data): Tag
    {
        if (empty($data['slug'])) {
            $data['slug'] = \Str::slug($data['name']);
        }

        return Tag::create($data);
    }

    public function update(int $id, array $data): Tag
    {
        $tag = $this->find($id, true); // Cho phép update cả khi đang soft delete

        if (empty($data['slug']) && !empty($data['name'])) {
            $data['slug'] = \Str::slug($data['name']);
        }

        $tag->update($data);

        return $tag;
    }

    public function delete(int $id): bool
    {
        $tag = $this->find($id);
        return $tag->delete();
    }

    public function restore(int $id): bool
    {
        $tag = Tag::onlyTrashed()->findOrFail($id);
        return $tag->restore();
    }

    public function forceDelete(int $id): bool
    {
        $tag = Tag::onlyTrashed()->findOrFail($id);
        return $tag->forceDelete();
    }

    public function attachTags(Model $model, array $tagIds): void
    {
        // Lấy cả tags đã bị xóa mềm (nếu muốn loại bỏ, có thể bỏ withTrashed)
        $existingTagIds = Tag::withTrashed()
            ->whereIn('id', $tagIds)
            ->pluck('id')
            ->toArray();

        if (!empty($existingTagIds)) {
            DB::transaction(function () use ($model, $existingTagIds) {
                $model->tags()->syncWithoutDetaching($existingTagIds);
            });
        }
    }

    public function detachTags(Model $model, array $tagIds = []): void
    {
        DB::transaction(function () use ($model, $tagIds) {
            if (empty($tagIds)) {
                $model->tags()->detach();
            } else {
                $existingTagIds = Tag::withTrashed()
                    ->whereIn('id', $tagIds)
                    ->pluck('id')
                    ->toArray();

                if (!empty($existingTagIds)) {
                    $model->tags()->detach($existingTagIds);
                }
            }
        });
    }
}