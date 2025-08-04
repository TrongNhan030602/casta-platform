<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Carbon;

class RefreshToken extends Model
{
    use HasFactory;
    protected $table = 'refresh_tokens';

    protected $fillable = [
        'user_id',
        'token_hash',
        'ip_address',
        'user_agent',
        'expires_at',
        'revoked',
        'revoked_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'revoked' => 'boolean',
        'revoked_at' => 'datetime',
    ];

    // Quan hệ user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scope giúp lấy token chưa bị thu hồi và chưa hết hạn
    public function scopeActive($query)
    {
        return $query->where('revoked', false)
            ->where('expires_at', '>', Carbon::now());
    }

    // Hàm tiện ích kiểm tra token còn hiệu lực hay không
    public function isActive(): bool
    {
        return !$this->revoked && $this->expires_at->isFuture();
    }
}