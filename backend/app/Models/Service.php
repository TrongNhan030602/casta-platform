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
        'name',             // Tên dịch vụ
        'slug',             // Đường dẫn thân thiện
        'category_id',      // ID danh mục dịch vụ
        'summary',          // Mô tả ngắn gọn
        'content',          // Nội dung chi tiết
        'price',            // Giá dịch vụ
        'currency',         // Đơn vị tiền tệ
        'duration_minutes', // Thời lượng (phút)
        'features',         // Tính năng (json)
        'featured_media_id',// Ảnh đại diện
        'gallery',          // Bộ sưu tập ảnh (json)
        'status',           // Trạng thái (draft, published, archived)
        'created_by',       // Người tạo
        'updated_by'        // Người cập nhật
    ];


    protected $casts = [
        'features' => 'array',
        'gallery' => 'array',
        'price' => 'decimal:2',
        'duration_minutes' => 'integer',
        'status' => ServiceStatus::class,
    ];

    // Quan hệ danh mục dịch vụ
    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id');
    }

    // Quan hệ media nổi bật
    public function featuredMedia()
    {
        return $this->belongsTo(Media::class, 'featured_media_id');
    }

    // Quan hệ tag
    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
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
    public function getFeaturedImageUrlAttribute()
    {
        return $this->featuredMedia?->url ?? null;
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