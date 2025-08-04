<?php
namespace App\Interfaces;

use App\Models\Category;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CategoryInterface
{
    public function getAll(int $perPage = 15): LengthAwarePaginator;

    public function create(array $data): Category;
    public function findById(int $id): Category;
    public function update(Category $category, array $data): Category;
    public function delete(Category $category): bool;
    public function getTree(array $filters = []): Collection;

}