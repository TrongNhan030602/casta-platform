<?php
namespace App\Repositories;

use App\Models\Product;
use App\Enums\ProductStockLogType;
use App\Models\ProductStockSummary;
use App\Interfaces\ProductStockSummaryInterface;

class ProductStockSummaryRepository implements ProductStockSummaryInterface
{
    public function findByProduct(Product $product): ?ProductStockSummary
    {
        return ProductStockSummary::where('product_id', $product->id)->first();
    }

    public function createOrUpdate(Product $product, int $stock, float $averageCost): ProductStockSummary
    {
        return ProductStockSummary::updateOrCreate(
            ['product_id' => $product->id],
            ['stock' => $stock, 'average_cost' => $averageCost]
        );
    }

    public function recalculate(Product $product): ProductStockSummary
    {
        $logs = $product->stockLogs()->orderBy('created_at')->orderBy('id')->get();

        $stock = 0;
        $totalCostQuantity = 0;
        $totalCostValue = 0;

        foreach ($logs as $log) {
            if ($log->type?->isImport()) {
                $stock += $log->quantity;

                if ($log->affect_cost && $log->unit_price !== null && $log->unit_price > 0) {
                    $totalCostQuantity += $log->quantity;
                    $totalCostValue += $log->quantity * $log->unit_price;
                }
            } elseif ($log->type?->isExport()) {
                $stock -= $log->quantity;
            }

            $averageCost = $totalCostQuantity > 0
                ? round($totalCostValue / $totalCostQuantity, 2)
                : 0;

            // Cập nhật vào log (giúp trace lại lịch sử biến động)
            $log->stock_after = $stock;
            $log->avg_cost_after = $averageCost;
            $log->saveQuietly(); // tránh triggering observer
        }

        return $this->createOrUpdate($product, max(0, $stock), $averageCost);
    }



}