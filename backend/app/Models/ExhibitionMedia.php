<?php

namespace App\Models;

use App\Enums\MediaType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExhibitionMedia extends Model
{
    use HasFactory;

    protected $table = 'exhibition_media';

    protected $fillable = [
        'exhibition_space_id',
        'type',
        'url',
        'caption',
        'order',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'type' => MediaType::class,
    ];

    public function exhibitionSpace()
    {
        return $this->belongsTo(ExhibitionSpace::class, 'exhibition_space_id');
    }
}