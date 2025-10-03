<?php

namespace App\Enums;

enum SubOrderStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Chờ xử lý',
            self::CONFIRMED => 'Đã xác nhận',
            self::SHIPPED => 'Đang giao',
            self::DELIVERED => 'Đã giao',
            self::CANCELLED => 'Đã huỷ',
        };
    }

    public function canTransitionTo(SubOrderStatus $target): bool
    {
        return match ($this) {
            self::PENDING => in_array($target, [self::CONFIRMED, self::CANCELLED]),
            self::CONFIRMED => in_array($target, [self::SHIPPED, self::CANCELLED]),
            self::SHIPPED => in_array($target, [self::DELIVERED, self::CANCELLED]),
            self::DELIVERED => false,
            self::CANCELLED => false,
        };
    }
}