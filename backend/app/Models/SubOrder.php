<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\SubOrderStatus;

class SubOrder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_id',
        'enterprise_id',
        'sub_total',
        'shipping_fee',
        'status',
        'tracking_number',
        'note',
    ];

    protected $casts = [
        'status' => SubOrderStatus::class,
    ];

    // Quan hệ
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function enterprise()
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Lấy trạng thái mới nhất
    public function latestStatus(): ?SubOrderStatus
    {
        $history = $this->statusHistories()->latest('created_at')->first();
        return $history ? SubOrderStatus::from($history->status) : $this->status;
    }

    // Tính tổng tiền đơn con (sub_total + shipping_fee)
    public function calculateTotal(): float
    {
        return round($this->sub_total + $this->shipping_fee, 2);
    }

    // Cập nhật trạng thái với kiểm tra transition
    public function updateStatus(SubOrderStatus $newStatus): bool
    {
        if ($this->status->canTransitionTo($newStatus)) {
            $this->status = $newStatus;
            $this->save();

            // Ghi vào lịch sử
            $this->statusHistories()->create([
                'status' => $newStatus->value,
                'changed_by' => auth()->id() ?? null,
            ]);

            return true;
        }

        return false;
    }
}