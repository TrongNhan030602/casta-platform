<?php

namespace App\Models;

use App\Enums\ExhibitionProductStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExhibitionSpaceProduct extends Model
{
    use HasFactory;

    protected $table = 'exhibition_space_products';

    protected $fillable = [
        'rental_contract_id',
        'product_id',
        'status',
        'note',
        'position_metadata',
    ];

    protected $casts = [
        'position_metadata' => 'array',
        'status' => ExhibitionProductStatus::class,
    ];

    public function rentalContract()
    {
        return $this->belongsTo(RentalContract::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}