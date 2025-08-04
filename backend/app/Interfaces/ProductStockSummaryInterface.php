<?php

namespace App\Interfaces;

use App\Models\Product;
use App\Models\ProductStockSummary;

interface ProductStockSummaryInterface
{
    public function findByProduct(Product $product): ?ProductStockSummary;

    public function createOrUpdate(Product $product, int $stock, float $averageCost): ProductStockSummary;

    public function recalculate(Product $product): ProductStockSummary;
}