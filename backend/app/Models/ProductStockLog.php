<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\ProductStockLogType;

class ProductStockLog extends Model
{
    use HasFactory;

    protected $table = 'product_stock_logs';

    protected $fillable = [
        'product_id',
        'type',
        'quantity',
        'unit_price',
        'note',
        'affect_cost',
        'stock_after',       // ✅ mới thêm
        'avg_cost_after',    // ✅ mới thêm
    ];

    protected $casts = [
        'type' => ProductStockLogType::class,
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'affect_cost' => 'boolean',
        'stock_after' => 'integer',
        'avg_cost_after' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}