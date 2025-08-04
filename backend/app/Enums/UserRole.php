<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case CVCC = 'cvcc';
    case CVQL = 'cvql';
    case QLGH = 'qlgh';
    case DN = 'dn';//
    case NVDN = 'nvdn'; // Phải thuộc về doanh nghiệp
    case KH = 'kh';
    case CSKH = 'cskh';
    case KT = 'kt';
    case QLND = 'qlnd';
    public static function systemRoles(): array
    {
        return [
            self::ADMIN,
            self::CVCC,
            self::CVQL,
            self::QLGH,
            self::CSKH,
            self::KT,
            self::QLND,
        ];
    }

    public static function enterpriseRoles(): array
    {
        return [self::DN, self::NVDN];
    }

    public static function customerRoles(): array
    {
        return [self::KH];
    }

    public static function requiresEnterpriseId(self $role): bool
    {
        return $role === self::NVDN;
    }

    public static function requiresEnterpriseProfile(self $role): bool
    {
        return in_array($role, self::enterpriseRoles());
    }

    public static function requiresCustomerProfile(self $role): bool
    {
        return in_array($role, self::customerRoles());
    }

    public static function isSystem(self $role): bool
    {
        return in_array($role, self::systemRoles());
    }
    public static function systemRolesValues(): array
    {
        return array_map(fn($r) => $r->value, self::systemRoles());
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
    public function powerLevel(): int
    {
        return match ($this) {
            self::ADMIN => 100,
            self::CVCC => 90,
            self::CVQL => 80,
            self::QLGH => 75,
            self::QLND => 70,
            self::CSKH, self::KT => 60,
            self::DN => 40,
            self::NVDN => 30,
            self::KH => 20,
        };
    }

    public function canManage(self $target): bool
    {
        return $this->powerLevel() > $target->powerLevel();
    }
}