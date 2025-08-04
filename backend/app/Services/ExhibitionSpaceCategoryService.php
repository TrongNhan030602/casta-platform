<?php

namespace App\Services;

use App\Models\ExhibitionSpaceCategory;
use App\Interfaces\ExhibitionSpaceCategoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ExhibitionSpaceCategoryService
{
    protected ExhibitionSpaceCategoryInterface $repo;

    public function __construct(ExhibitionSpaceCategoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function getAll(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repo->getAll($filters, $perPage);
    }

    public function getTree()
    {
        return $this->repo->getTree();
    }

    public function findById(int $id): ?ExhibitionSpaceCategory
    {
        return $this->repo->findById($id);
    }

    public function create(array $data): ExhibitionSpaceCategory
    {
        return $this->repo->create($data);
    }

    public function update(ExhibitionSpaceCategory $category, array $data): ExhibitionSpaceCategory
    {
        return $this->repo->update($category, $data);
    }

    public function delete(ExhibitionSpaceCategory $category): bool
    {
        return $this->repo->delete($category);
    }



}