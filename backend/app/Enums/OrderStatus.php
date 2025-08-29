<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case SHIPPING = 'shipping';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case RETURNED = 'returned';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function finalStatuses(): array
    {
        return [self::COMPLETED, self::CANCELLED, self::RETURNED];
    }

    public function isFinal(): bool
    {
        return in_array($this, self::finalStatuses(), true);
    }
}