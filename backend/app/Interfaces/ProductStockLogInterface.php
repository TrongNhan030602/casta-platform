<?php
namespace App\Interfaces;

use App\Models\Product;
use App\Models\ProductStockLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductStockLogInterface
{
    public function getByProduct(Product $product, array $filters = [], int $perPage = 15): LengthAwarePaginator;


    public function findProductOrFail(int $productId): Product;
    public function createForProduct(Product $product, array $data): ProductStockLog;
}