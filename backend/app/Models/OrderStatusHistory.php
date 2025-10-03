<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\OrderHistoryStatus;

class OrderStatusHistory extends Model
{
    use SoftDeletes;

    protected $table = 'order_status_history';

    protected $fillable = [
        'order_id',
        'sub_order_id',
        'status',
        'note',
        'changed_by',
    ];

    protected $casts = [
        'status' => OrderHistoryStatus::class,
        'created_at' => 'datetime',
    ];

    // Quan hệ
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function subOrder()
    {
        return $this->belongsTo(SubOrder::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    // Lấy label trực tiếp
    public function statusLabel(): string
    {
        return $this->status->label();
    }
}