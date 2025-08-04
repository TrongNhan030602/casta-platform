<?php

namespace App\Interfaces;

use App\Models\ExhibitionSpace;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ExhibitionSpaceInterface
{
    public function getAll(array $filters, int $perPage = 15): LengthAwarePaginator;
    public function findById(int $id): ?ExhibitionSpace;
    public function getSelectableSpaces(): ?Collection;

    public function findOrFail(int $id): ExhibitionSpace;
    public function findWithRelations(int $id): ?ExhibitionSpace;

    public function create(array $data): ExhibitionSpace;
    public function update(ExhibitionSpace $space, array $data): ExhibitionSpace;
    public function delete(ExhibitionSpace $space): bool;
    public function getEnterprisesUsingSpace(int $spaceId): array;

}