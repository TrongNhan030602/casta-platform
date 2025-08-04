<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductStockSummary extends Model
{
    protected $table = 'product_stock_summary';

    protected $fillable = [
        'product_id',
        'stock', // tồn kho hiện tại
        'average_cost', // giá vốn trung bình
    ];

    /**
     * Quan hệ tới sản phẩm
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}