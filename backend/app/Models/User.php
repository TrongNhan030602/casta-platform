<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Models\Customer;
use App\Enums\UserStatus;
use App\Models\Enterprise;
use App\Enums\EnterpriseStatus;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'verification_token',
        'email_verified_at',
        'verification_token_expires_at',
        'reactivation_requested',
        'reactivation_requested_at',
        'enterprise_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'verification_token_expires_at' => 'datetime',
        'reactivation_requested_at' => 'datetime',
        'reactivation_requested' => 'boolean',
        'role' => UserRole::class,
        'status' => UserStatus::class,
    ];

    public function isEmailVerified(): bool
    {
        return !is_null($this->email_verified_at);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }




    /**
     * Liên kết khi user là doanh nghiệp chính (dn)
     */
    public function enterprise(): HasOne
    {
        return $this->hasOne(Enterprise::class);
    }

    /**
     * Liên kết khi user là khách hàng (kh)
     */
    public function customer(): HasOne
    {
        return $this->hasOne(Customer::class);
    }

    /**
     * Liên kết khi user là nhân viên doanh nghiệp (nvdn)
     */
    public function enterpriseBelongingTo(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class, 'enterprise_id');
    }

    public function loginLogs()
    {
        return $this->hasMany(LoginLog::class);
    }

    public function violations()
    {
        return $this->hasMany(Violation::class);
    }


    // ================== Helpers =====================================================================
    // Trong User.php
    public function getRealEnterpriseIdAttribute(): ?int
    {
        if (!UserRole::requiresEnterpriseProfile($this->role)) {
            return null;
        }

        return match ($this->role) {
            UserRole::DN => $this->enterprise?->id,
            UserRole::NVDN => $this->enterprise_id,
            default => null,
        };
    }



    // Kiểm tra người dùng là DN chính (DN) – không có enterprise_id
    public function isMainEnterprise(): bool
    {
        return $this->role === UserRole::DN && is_null($this->enterprise_id);
    }

    // Kiểm tra người dùng là nhân viên DN – có enterprise_id
    public function isEnterpriseStaff(): bool
    {
        return $this->role === UserRole::NVDN && !is_null($this->enterprise_id);
    }

    // Tổng quát: Người dùng là DN (chính hoặc nhân viên)
    public function isEnterprise(): bool
    {
        return in_array($this->role, UserRole::enterpriseRoles()); // so sánh enum với enum
    }


    // Người dùng là hệ thống (admin, cvcc, cvql, ...)
    public function isSystemUser(): bool
    {
        return in_array($this->role, [UserRole::ADMIN, UserRole::CVCC]);
    }


    // Người dùng là khách hàng
    public function isCustomer(): bool
    {
        return $this->role === UserRole::KH;
    }


    public function canManageEnterpriseId(int $enterpriseId): bool
    {
        if ($this->isSystemUser()) {
            return true;
        }

        return $this->getRealEnterpriseIdAttribute() === $enterpriseId;
    }



    // Helper Kiểm tra hồ sơ doanh nghiệp đã được duyệt hay chưa
    public function hasApprovedProfile(): bool
    {
        if (!$this->isEnterprise()) {
            return true;
        }

        $enterprise = $this->isMainEnterprise()
            ? $this->enterprise
            : $this->enterpriseBelongingTo;

        return $enterprise?->status === EnterpriseStatus::APPROVED;
    }




}