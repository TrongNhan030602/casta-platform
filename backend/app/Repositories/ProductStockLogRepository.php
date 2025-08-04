<?php
namespace App\Repositories;

use App\Models\Product;
use App\Models\ProductStockLog;
use App\Interfaces\ProductStockLogInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
class ProductStockLogRepository implements ProductStockLogInterface
{
    public function getByProduct(Product $product, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $product->stockLogs();

        // Áp dụng lọc theo type
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        // Áp dụng lọc theo keyword trong ghi chú
        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->where('note', 'like', "%{$keyword}%");
        }

        // Xử lý sort
        $allowedSorts = ['created_at', 'quantity', 'unit_price', 'stock_after', 'avg_cost_after'];
        $sortBy = in_array($filters['sort_by'] ?? '', $allowedSorts) ? $filters['sort_by'] : 'created_at';
        $sortOrder = in_array(strtolower($filters['sort_order'] ?? ''), ['asc', 'desc']) ? $filters['sort_order'] : 'desc';

        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate($perPage);
    }



    public function createForProduct(Product $product, array $data): ProductStockLog
    {
        return DB::transaction(function () use ($product, $data) {
            $log = $product->stockLogs()->create($data);
            $product->recalculateStock(); // cập nhật lại tồn kho
            return $log;
        });
    }
    public function findProductOrFail(int $productId): Product
    {
        $product = Product::find($productId);

        if (!$product) {
            abort(404, 'Sản phẩm không tồn tại hoặc đã bị xoá.');
        }

        return $product;
    }
}