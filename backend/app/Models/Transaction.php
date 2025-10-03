<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\TransactionStatus;
use App\Enums\TransactionMethod;

class Transaction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_id',
        'sub_order_id',
        'amount',
        'method',
        'status',
        'reference_code',
        'note',
        'paid_at',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'status' => TransactionStatus::class,
        'method' => TransactionMethod::class,
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

    // Lấy label trực tiếp
    public function statusLabel(): string
    {
        return $this->status->label();
    }

    public function methodLabel(): string
    {
        return $this->method->label();
    }

    // Cập nhật trạng thái với kiểm tra transition
    public function updateStatus(TransactionStatus $newStatus): bool
    {
        if ($this->status->canTransitionTo($newStatus)) {
            $this->status = $newStatus;
            if ($newStatus === TransactionStatus::SUCCESS) {
                $this->paid_at = now();
            }
            $this->save();
            return true;
        }
        return false;
    }
}