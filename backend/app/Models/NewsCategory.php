<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\NewsCategoryStatus;

class NewsCategory extends Model
{
    use SoftDeletes;

    protected $table = 'news_categories';

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
        'description',
        'image_id',
        'order',
        'status',
        'created_by',
        'updated_by'
    ];

    // Sử dụng cast enum cho trường status
    protected $casts = [
        'status' => NewsCategoryStatus::class,
        'order' => 'integer',
    ];

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'category_id');
    }

    public function image()
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    // Kiểm tra trạng thái nhanh
    public function isPublished(): bool
    {
        return $this->status === NewsCategoryStatus::PUBLISHED;
    }

    public function isDraft(): bool
    {
        return $this->status === NewsCategoryStatus::DRAFT;
    }

    public function isArchived(): bool
    {
        return $this->status === NewsCategoryStatus::ARCHIVED;
    }

    // Scope filter trạng thái
    public function scopeStatus($query, NewsCategoryStatus $status)
    {
        return $query->where('status', $status->value);
    }

    // Người tạo
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Người cập nhật
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}