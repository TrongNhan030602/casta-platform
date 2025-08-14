<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use SoftDeletes;

    protected $table = 'media';

    protected $fillable = [
        'disk',        // local, s3...
        'path',        // đường dẫn lưu file
        'url',         // link truy cập file
        'mime',        // kiểu file
        'size',        // dung lượng
        'meta',        // thông tin bổ sung (json)
        'uploaded_by'  // id người upload
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    /**
     * Người upload file
     */
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Liên kết với Posts
     */
    public function posts()
    {
        return $this->morphedByMany(Post::class, 'mediable')
            ->withPivot('role') // để biết media này là featured / gallery / attachment
            ->withTimestamps();
    }

    /**
     * Liên kết với Services
     */
    public function services()
    {
        return $this->morphedByMany(Service::class, 'mediable')
            ->withPivot('role')
            ->withTimestamps();
    }
}