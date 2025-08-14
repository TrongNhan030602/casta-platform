<?php
namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Post;

interface PostInterface
{
    public function publicSearch(array $filters): LengthAwarePaginator;

    public function find(int $id): Post;

    public function store(array $data): Post;

    public function update(int $id, array $data): Post;

    public function delete(int $id, bool $cascade = false): bool;

    public function restore(int $id): bool;

    public function forceDelete(int $id, bool $cascade = false): bool;
}