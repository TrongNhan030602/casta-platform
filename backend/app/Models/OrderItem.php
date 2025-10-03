<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'sub_order_id',
        'product_id',
        'quantity',
        'price',
        'total_price',
        'snapshot',
        'note',
    ];

    protected $casts = [
        'snapshot' => 'array',
    ];

    // Quan hệ
    public function subOrder()
    {
        return $this->belongsTo(SubOrder::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Tính tổng tiền tự động
    public function calculateTotalPrice(): float
    {
        return round($this->quantity * $this->price, 2);
    }

    // Ghi snapshot sản phẩm lúc đặt
    public function setSnapshotFromProduct(): void
    {
        $this->snapshot = [
            'id' => $this->product->id,
            'name' => $this->product->name,
            'sku' => $this->product->sku ?? null,
            'price' => $this->price,
            'attributes' => $this->product->attributes ?? [],
        ];
    }

    // Trước khi save, tính total_price nếu chưa có
    protected static function booted()
    {
        static::creating(function ($item) {
            if (!$item->total_price) {
                $item->total_price = $item->calculateTotalPrice();
            }
        });
    }
}