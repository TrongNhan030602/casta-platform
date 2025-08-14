<?php

namespace App\Services;

use App\Interfaces\ServiceInterface;
use Illuminate\Support\Facades\Auth;
use App\Models\Service;

class ServiceService
{
    protected $repo;

    public function __construct(ServiceInterface $repo)
    {
        $this->repo = $repo;
    }

    public function publicSearch(array $filters)
    {
        return $this->repo->publicSearch($filters);
    }

    public function find(int $id): Service
    {
        return $this->repo->find($id);
    }

    public function create(array $data): Service
    {
        $data['created_by'] = Auth::id();
        return $this->repo->store($data);
    }

    public function update(int $id, array $data): Service
    {
        $data['updated_by'] = Auth::id();
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->repo->delete($id);
    }

    public function restore(int $id): bool
    {
        return $this->repo->restore($id);
    }

    public function forceDelete(int $id): bool
    {
        return $this->repo->forceDelete($id);
    }
}