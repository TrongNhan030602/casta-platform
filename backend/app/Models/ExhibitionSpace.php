<?php

namespace App\Models;

use App\Enums\ExhibitionSpaceStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExhibitionSpace extends Model
{
    use HasFactory;

    protected $table = 'exhibition_spaces';

    protected $fillable = [
        'category_id',
        'code',
        'name',
        'location',
        'zone',
        'size',
        'status',
        'price',
        'description',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'status' => ExhibitionSpaceStatus::class,
    ];

    public function category()
    {
        return $this->belongsTo(ExhibitionSpaceCategory::class, 'category_id');
    }

    public function media()
    {
        return $this->hasMany(ExhibitionMedia::class)->orderBy('order');
    }

    public function rentalContracts()
    {
        return $this->hasMany(RentalContract::class);
    }

    public function approvedContracts()
    {
        return $this->rentalContracts()->where('status', 'approved');
    }
}