<?php

namespace App\Models;

use App\Enums\PostType;
use App\Enums\PostStatus;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;

    protected $table = 'posts';

    protected $fillable = [
        'type',
        'title',
        'slug',
        'category_id',
        'summary',
        'content',
        'gallery',
        'tags_cached',
        'status',
        'is_sticky',
        'published_at',
        'author_id',
        'event_location',
        'event_start',
        'event_end',
        'meta_title',
        'meta_description',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'type' => PostType::class,
        'status' => PostStatus::class,
        'gallery' => 'array',
        'is_sticky' => 'boolean',
        'published_at' => 'datetime',
    ];
    protected static function booted()
    {
        static::deleted(function (Post $post) {
            if ($post->isForceDeleting()) {
                $mediaList = $post->media; // Lấy tất cả media liên kết

                // Xóa pivot
                $post->media()->detach();

                foreach ($mediaList as $media) {
                    // Kiểm tra media còn được dùng ở entity khác không
                    $totalRelations = $media->posts()->count() + $media->services()->count();
                    if ($totalRelations === 0) {
                        // Xóa file vật lý
                        if (Storage::disk($media->disk)->exists($media->path)) {
                            Storage::disk($media->disk)->delete($media->path);
                        }
                        // Xóa record media
                        $media->forceDelete();
                    }
                }
            }
        });
    }


    // Relationships
    public function category()
    {
        return $this->belongsTo(NewsCategory::class, 'category_id');
    }

    public function author()
    {
        return $this->belongsTo(\App\Models\User::class, 'author_id');
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

    // Helpers kiểm tra loại bài viết
    public function isNews(): bool
    {
        return $this->type === PostType::NEWS;
    }

    public function isEvent(): bool
    {
        return $this->type === PostType::EVENT;
    }

    // Helpers trạng thái
    public function isPublished(): bool
    {
        return $this->status === PostStatus::PUBLISHED;
    }

    public function isDraft(): bool
    {
        return $this->status === PostStatus::DRAFT;
    }

    public function isArchived(): bool
    {
        return $this->status === PostStatus::ARCHIVED;
    }

    // Scopes
    public function scopeStatus($query, PostStatus $status)
    {
        return $query->where('status', $status->value);
    }

    public function scopeType($query, PostType $type)
    {
        return $query->where('type', $type->value);
    }

    // Helper tạo slug duy nhất
    public static function makeSlug(string $title): string
    {
        $base = Str::slug($title, '-');
        $slug = $base;
        $i = 1;

        while (self::where('slug', $slug)->withTrashed()->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    // Lấy URL featured image đầu tiên
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