<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\ServiceCategoryStatus;

class ServiceCategory extends Model
{
    use SoftDeletes;

    protected $table = 'service_categories';

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

    // Cast enum cho status, kiểu integer cho order
    protected $casts = [
        'status' => ServiceCategoryStatus::class,
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

    public function services()
    {
        return $this->hasMany(Service::class, 'category_id');
    }

    public function image()
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    // Các method kiểm tra trạng thái
    public function isDraft(): bool
    {
        return $this->status === ServiceCategoryStatus::DRAFT;
    }

    public function isPublished(): bool
    {
        return $this->status === ServiceCategoryStatus::PUBLISHED;
    }

    public function isArchived(): bool
    {
        return $this->status === ServiceCategoryStatus::ARCHIVED;
    }

    // Scope lọc theo trạng thái
    public function scopeStatus($query, ServiceCategoryStatus $status)
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