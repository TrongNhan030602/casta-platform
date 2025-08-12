<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use SoftDeletes;

    // Khai báo bảng (nếu cần, mặc định là 'media')
    protected $table = 'media';

    // Các trường được phép gán hàng loạt
    protected $fillable = [
        'disk',        // Vị trí lưu trữ (local, s3, etc)
        'path',        // Đường dẫn file trên disk
        'url',         // URL truy cập file (có thể null)
        'mime',        // Kiểu file MIME
        'size',        // Kích thước file (bytes)
        'meta',        // Metadata dạng JSON (width, height, alt, caption,...)
        'uploaded_by'  // ID người upload
    ];

    // Chuyển kiểu tự động cho trường meta
    protected $casts = [
        'meta' => 'array',
    ];

    // Quan hệ người upload file
    public function uploader()
    {
        return $this->belongsTo(\App\Models\User::class, 'uploaded_by');
    }


}