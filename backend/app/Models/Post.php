<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use App\Enums\PostType;
use App\Enums\PostStatus;

class Post extends Model
{
    use SoftDeletes;
    protected $table = 'posts';

    protected $fillable = [
        'type',           // loại bài: news/event
        'title',          // tiêu đề bài viết
        'slug',           // đường dẫn thân thiện
        'category_id',    // danh mục tin tức
        'summary',        // tóm tắt
        'content',        // nội dung chi tiết
        'featured_media_id', // ảnh nổi bật
        'gallery',        // bộ sưu tập ảnh (json)
        'tags_cached',    // cache tag dạng string
        'status',         // trạng thái bài
        'is_sticky',      // ghim bài
        'published_at',   // ngày xuất bản
        'author_id',      // tác giả
        'event_location', // địa điểm sự kiện
        'event_start',    // bắt đầu sự kiện
        'event_end',      // kết thúc sự kiện
        'meta_title',     // meta SEO tiêu đề
        'meta_description', // meta SEO mô tả
        'created_by',     // người tạo
        'updated_by'      // người cập nhật
    ];

    protected $casts = [
        'type' => PostType::class,
        'status' => PostStatus::class,
        'gallery' => 'array',
        'is_sticky' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(NewsCategory::class, 'category_id');
    }

    public function author()
    {
        return $this->belongsTo(\App\Models\User::class, 'author_id');
    }

    public function featuredMedia()
    {
        return $this->belongsTo(Media::class, 'featured_media_id');
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    // Helper kiểm tra loại bài viết
    public function isNews(): bool
    {
        return $this->type === PostType::NEWS;
    }

    public function isEvent(): bool
    {
        return $this->type === PostType::EVENT;
    }

    // Helper kiểm tra trạng thái
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

    // Scope lọc theo status
    public function scopeStatus($query, PostStatus $status)
    {
        return $query->where('status', $status->value);
    }

    // Scope lọc theo type
    public function scopeType($query, PostType $type)
    {
        return $query->where('type', $type->value);
    }

    // helper để tạo slug duy nhất
    public static function makeSlug($title)
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