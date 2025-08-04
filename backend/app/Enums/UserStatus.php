<?php

namespace App\Enums;

enum UserStatus: string
{
    case PENDING = 'pending';
    case REJECTED = 'rejected';
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}