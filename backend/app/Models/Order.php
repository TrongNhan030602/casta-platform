<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\PaymentMethod;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'customer_id',
        'total_amount',
        'shipping_fee_total',
        'status',
        'payment_status',
        'payment_method',
        'note',
    ];

    protected $casts = [
        'status' => OrderStatus::class,
        'payment_status' => PaymentStatus::class,
        'payment_method' => PaymentMethod::class,
    ];

    // Quan hệ
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function subOrders()
    {
        return $this->hasMany(SubOrder::class);
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
    public function latestStatus(): ?OrderStatus
    {
        $history = $this->statusHistories()->latest('created_at')->first();
        return $history ? OrderStatus::from($history->status) : $this->status;
    }

    // Tính tổng tiền từ subOrders (bao gồm phí ship)
    public function calculateTotalAmount(): float
    {
        return round($this->subOrders->sum(fn($subOrder) => $subOrder->sub_total + $subOrder->shipping_fee), 2);
    }

    // Tính tổng phí ship riêng
    public function calculateTotalShippingFee(): float
    {
        return round($this->subOrders->sum(fn($subOrder) => $subOrder->shipping_fee), 2);
    }


    // Cập nhật trạng thái với kiểm tra transition
    public function updateStatus(OrderStatus $newStatus): bool
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