<?php
namespace App\Services;

use App\Models\Product;
use App\Enums\ProductStockLogType;
use App\Interfaces\ProductStockLogInterface;
use App\Interfaces\ProductStockSummaryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductStockLogService
{
    protected ProductStockLogInterface $repo;
    protected ProductStockSummaryInterface $summaryRepo;

    public function __construct(
        ProductStockLogInterface $repo,
        ProductStockSummaryInterface $summaryRepo
    ) {
        $this->repo = $repo;
        $this->summaryRepo = $summaryRepo;
    }

    public function getByProduct(Product $product, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repo->getByProduct($product, $filters, $perPage);
    }


    public function findProductOrFail(int $productId): Product
    {
        return $this->repo->findProductOrFail($productId);
    }

    public function createForProduct(Product $product, array $data)
    {
        // ✅ Tự động xác định affect_cost nếu chưa có
        if (!array_key_exists('affect_cost', $data)) {
            $type = ProductStockLogType::from($data['type']);
            $data['affect_cost'] = $type->affectCostByDefault();
        }

        $log = $this->repo->createForProduct($product, $data);

        // ✅ Tính toán lại tồn kho và giá vốn trung bình
        $this->summaryRepo->recalculate($product);

        return $log;
    }

}