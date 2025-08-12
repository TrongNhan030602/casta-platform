<?php

namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

use App\Models\Product;

interface ProductInterface
{
    public function publicSearch(array $filters): LengthAwarePaginator;
    public function store(array $data): Product;
    public function update(Product $product, array $data): Product;
    public function delete(Product $product): bool;
    public function updateStatus(Product $product, array $data): ?Product;
    public function findWithTrashed(int $id): Product;
    public function restore(Product $product): bool;
    public function getCompactByEnterprise(int $enterpriseId);



}