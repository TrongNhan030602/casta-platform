<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExhibitionSpaceCategory extends Model
{
    use HasFactory;

    protected $table = 'exhibition_space_categories';

    protected $fillable = [
        'name',
        'description',
        'parent_id',
    ];

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function spaces()
    {
        return $this->hasMany(ExhibitionSpace::class, 'category_id');
    }
}