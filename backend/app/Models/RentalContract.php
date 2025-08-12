<?php

namespace App\Models;

use App\Enums\RentalContractStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RentalContract extends Model
{
    use HasFactory;

    protected $table = 'rental_contracts';

    protected $fillable = [
        "code",
        'enterprise_id',
        'exhibition_space_id',
        'start_date',
        'end_date',
        'total_cost',
        'additional_cost',
        'status',
        'approved_at',
        'reviewed_by',
        'unit_price',
        'cancel_reason',
        'extend_requested_at',
        'is_public',
        'public_slug',
        'created_by', // khi admin tạo offline
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'approved_at' => 'datetime',
        'extend_requested_at' => 'datetime',
        'status' => RentalContractStatus::class,
    ];
    protected static function booted()
    {
        static::creating(function ($contract) {
            $latestId = RentalContract::max('id') + 1;
            $contract->code = 'HĐ-' . str_pad($latestId, 5, '0', STR_PAD_LEFT);
        });
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function enterprise()
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function space()
    {
        return $this->belongsTo(ExhibitionSpace::class, 'exhibition_space_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function spaceProducts()
    {
        return $this->hasMany(ExhibitionSpaceProduct::class);
    }
}