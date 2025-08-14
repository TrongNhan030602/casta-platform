<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tag extends Model
{
    use SoftDeletes;
    protected $table = 'tags';

    protected $fillable = [
        'name', // Tên tag
        'slug'  // Đường dẫn thân thiện
    ];

    /**
     * Các bài viết (posts) liên kết với tag này (quan hệ đa hình)
     */
    public function posts()
    {
        return $this->morphedByMany(Post::class, 'taggable');
    }

    /**
     * Các dịch vụ (services) liên kết với tag này (quan hệ đa hình)
     */
    public function services()
    {
        return $this->morphedByMany(Service::class, 'taggable');
    }

    public function featuredInPosts()
    {
        return $this->hasMany(Post::class, 'featured_media_id');
    }

    public function featuredInServices()
    {
        return $this->hasMany(Service::class, 'featured_media_id');
    }

}