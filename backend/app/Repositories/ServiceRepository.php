<?php

namespace App\Repositories;

use App\Models\Service;
use App\Enums\ServiceStatus;
use App\Interfaces\ServiceInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ServiceRepository implements ServiceInterface
{
    public function publicSearch(array $filters): LengthAwarePaginator
    {
        $query = Service::query();

        // Lọc soft-deleted
        $deleted = $filters['deleted'] ?? 'none';
        if ($deleted === 'only')
            $query->onlyTrashed();
        if ($deleted === 'all')
            $query->withTrashed();

        if (!empty($filters['status']) && in_array($filters['status'], ServiceStatus::values())) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                    ->orWhere('content', 'like', "%{$keyword}%");
            });
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $query->with(['category', 'tags', 'media', 'createdBy', 'updatedBy']);

        $perPage = $filters['per_page'] ?? 15;
        return $query->paginate($perPage);
    }

    public function find(int $id): Service
    {
        return Service::withTrashed()
            ->with(['category', 'tags', 'media', 'createdBy', 'updatedBy'])
            ->findOrFail($id);
    }

    public function store(array $data): Service
    {
        return DB::transaction(function () use ($data) {
            $tags = $data['tags'] ?? [];
            unset($data['tags']);

            $service = Service::create($data);

            if (!empty($tags)) {
                $service->tags()->sync($tags);
                $service->save();
            }

            $service->load(['category', 'tags', 'media', 'createdBy', 'updatedBy']);
            return $service;
        });
    }

    public function update(int $id, array $data): Service
    {
        return DB::transaction(function () use ($id, $data) {
            $service = $this->find($id);

            $tags = $data['tags'] ?? null;
            unset($data['tags']);

            $service->update($data);

            if (is_array($tags)) {
                $service->tags()->sync($tags);
                $service->save();
            }

            $service->load(['category', 'tags', 'media', 'createdBy', 'updatedBy']);
            return $service;
        });
    }

    public function delete(int $id, bool $cascade = false): bool
    {
        $service = $this->find($id);
        return $service->delete();
    }

    public function restore(int $id): bool
    {
        $service = Service::withTrashed()->findOrFail($id);
        return $service->restore();
    }

    public function forceDelete(int $id, bool $cascade = false): bool
    {
        $service = Service::withTrashed()->findOrFail($id);
        return $service->forceDelete();
    }
}