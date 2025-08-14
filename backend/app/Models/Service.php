<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\ServiceStatus;

class Service extends Model
{
    use SoftDeletes;

    protected $table = 'services';

    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'summary',
        'content',
        'price',
        'currency',
        'duration_minutes',
        'features',
        'gallery',
        'status',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'features' => 'array',
        'gallery' => 'array',
        'price' => 'decimal:2',
        'duration_minutes' => 'integer',
        'status' => ServiceStatus::class,
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id');
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable')->withTimestamps();
    }

    public function media()
    {
        return $this->morphToMany(Media::class, 'mediable')->withTimestamps();
    }

    // Nếu muốn phân loại media theo role, ví dụ featured/gallery
    public function featuredMedia()
    {
        return $this->media()->wherePivot('role', 'featured');
    }

    public function galleryMedia()
    {
        return $this->media()->wherePivot('role', 'gallery');
    }

    // Kiểm tra trạng thái nhanh
    public function isDraft(): bool
    {
        return $this->status === ServiceStatus::DRAFT;
    }

    public function isPublished(): bool
    {
        return $this->status === ServiceStatus::PUBLISHED;
    }

    public function isArchived(): bool
    {
        return $this->status === ServiceStatus::ARCHIVED;
    }

    // Scope lọc trạng thái
    public function scopeStatus($query, ServiceStatus $status)
    {
        return $query->where('status', $status->value);
    }

    // Lấy URL ảnh nổi bật
    public function getFeaturedImageUrlAttribute(): ?string
    {
        return $this->featuredMedia()->first()?->url;
    }

    // Người tạo / cập nhật
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}