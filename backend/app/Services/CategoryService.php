<?php
namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Collection;
use App\Interfaces\CategoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CategoryService
{
    protected CategoryInterface $repo;

    public function __construct(CategoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repo->getAll($perPage);
    }


    public function create(array $data): Category
    {
        return $this->repo->create($data);
    }
    public function findById(int $id): Category
    {
        return $this->repo->findById($id);
    }

    public function update(Category $category, array $data): Category
    {
        return $this->repo->update($category, $data);
    }

    public function delete(Category $category): bool
    {
        return $this->repo->delete($category);
    }

    public function getTree(array $filters = []): Collection
    {
        return $this->repo->getTree($filters);
    }


}