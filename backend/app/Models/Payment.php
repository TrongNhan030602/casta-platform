<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';

    protected $fillable = [
        'order_id',
        'amount',
        'method',
        'transaction_code',
        'status',
        'paid_at',
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}