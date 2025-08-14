<?php
namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\ServiceCategory;

interface ServiceCategoryInterface
{
    public function publicSearch(array $filters): LengthAwarePaginator;
    public function store(array $data): ServiceCategory;
    public function update(int $id, array $data): ServiceCategory;
    public function delete(int $id, bool $cascade = false): bool;
    public function find(int $id): ServiceCategory;
    public function restore(int $id, bool $restoreParent = true): bool;
    public function forceDelete(int $id, bool $cascade = false): bool;
    public function getTree();
}