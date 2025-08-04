<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseApiController;
use App\Models\Product;
use App\Services\ProductStockSummaryService;
use Illuminate\Http\JsonResponse;

class ProductStockSummaryController extends BaseApiController
{
    protected ProductStockSummaryService $service;

    public function __construct(ProductStockSummaryService $service)
    {
        $this->service = $service;
    }

    /**
     * Lấy tồn kho và giá vốn trung bình của sản phẩm
     */
    public function show(int $productId): JsonResponse
    {
        return $this->safe(function () use ($productId) {
            $product = Product::findOrFail($productId);

            // Nếu có quyền, có thể authorize ở đây: $this->authorize('view', $product);

            $summary = $this->service->getSummaryByProduct($product);

            if (!$summary) {
                return response()->json([
                    'message' => 'Chưa có dữ liệu tồn kho cho sản phẩm này.'
                ], 404);
            }

            return response()->json([
                'data' => [
                    'product_id' => $product->id,
                    'stock' => $summary->stock,
                    'average_cost' => $summary->average_cost,
                    'updated_at' => $summary->updated_at,
                ],
            ]);
        });
    }
}