<?php

namespace App\Models;

use App\Enums\EnterpriseStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enterprise extends Model
{
    use HasFactory;
    protected $table = 'enterprises';

    protected $fillable = [
        'user_id',
        'company_name',
        'tax_code',
        'business_field',
        'district',
        'address',
        'representative',
        'phone',
        'email',
        'website',
        'logo_url',
        'documents',
        'status',
        'approved_at',
        'reviewed_by',
    ];

    protected $casts = [
        'documents' => 'array',
        'approved_at' => 'datetime',
        'status' => EnterpriseStatus::class,
    ];

    // Doanh nghiệp thuộc về một tài khoản người dùng (đại diện)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Người duyệt hồ sơ (thường là Admin hoặc CVCC)
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // Lấy hợp đồng công khai của doanh nghiệp (chỉ có một hợp đồng công khai mới nhất)
    public function publicContract()
    {
        return $this->hasOne(RentalContract::class)->where('is_public', true);
    }

}