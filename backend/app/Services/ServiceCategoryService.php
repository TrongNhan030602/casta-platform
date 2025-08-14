<?php
namespace App\Services;

use App\Interfaces\ServiceCategoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\ServiceCategory;

class ServiceCategoryService
{
    protected ServiceCategoryInterface $repo;

    public function __construct(ServiceCategoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function publicSearch(array $filters): LengthAwarePaginator
    {
        return $this->repo->publicSearch($filters);
    }

    public function store(array $data): ServiceCategory
    {
        $data['created_by'] = auth()->id();
        $data['updated_by'] = auth()->id();

        return $this->repo->store($data);
    }

    public function update(int $id, array $data): ServiceCategory
    {
        $data['updated_by'] = auth()->id();

        return $this->repo->update($id, $data);
    }

    public function delete(int $id, bool $cascade = false): bool
    {
        return $this->repo->delete($id, $cascade);
    }

    public function find(int $id): ServiceCategory
    {
        return $this->repo->find($id);
    }

    public function restore(int $id, bool $restoreParent = true): bool
    {
        return $this->repo->restore($id, $restoreParent);
    }

    public function forceDelete(int $id, bool $cascade = false): bool
    {
        return $this->repo->forceDelete($id, $cascade);
    }

    public function getTree()
    {
        return $this->repo->getTree();
    }
}