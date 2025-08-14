<?php
namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\NewsCategory;

interface NewsCategoryInterface
{
    public function publicSearch(array $filters): LengthAwarePaginator;
    public function store(array $data): NewsCategory;
    public function update(int $id, array $data): NewsCategory;
    public function delete(int $id, bool $cascade = false): bool;
    public function find(int $id): NewsCategory;
    public function restore(int $id, bool $restoreParent = true): bool;
    public function forceDelete(int $id, bool $cascade = false): bool;
    public function getTree();
}