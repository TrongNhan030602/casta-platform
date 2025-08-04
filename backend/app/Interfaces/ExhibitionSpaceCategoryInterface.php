<?php

namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\ExhibitionSpaceCategory;

interface ExhibitionSpaceCategoryInterface
{
    public function getAll(array $filters, int $perPage = 15): LengthAwarePaginator;

    public function getTree();

    public function findById(int $id): ?ExhibitionSpaceCategory;

    public function create(array $data): ExhibitionSpaceCategory;

    public function update(ExhibitionSpaceCategory $category, array $data): ExhibitionSpaceCategory;

    public function delete(ExhibitionSpaceCategory $category): bool;
}