<?php

namespace App\Interfaces;

use App\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ServiceInterface
{
    public function publicSearch(array $filters): LengthAwarePaginator;
    public function find(int $id): Service;
    public function store(array $data): Service;
    public function update(int $id, array $data): Service;
    public function delete(int $id, bool $cascade = false): bool;
    public function restore(int $id): bool;
    public function forceDelete(int $id, bool $cascade = false): bool;
}