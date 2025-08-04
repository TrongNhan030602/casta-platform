<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductStockSummary;
use App\Repositories\ProductStockSummaryRepository;

class ProductStockSummaryService
{
    protected ProductStockSummaryRepository $repo;

    public function __construct(ProductStockSummaryRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getSummaryByProduct(Product $product): ?ProductStockSummary
    {
        return $this->repo->findByProduct($product);
    }

    public function recalculate(Product $product): ProductStockSummary
    {
        return $this->repo->recalculate($product);
    }
}