<?php

namespace App\Enums;

enum OrderHistoryStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';
    case PARTIALLY_DELIVERED = 'partially_delivered';
    case COMPLETED = 'completed';
    case REFUNDED = 'refunded';

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
            self::PARTIALLY_DELIVERED => 'Giao một phần',
            self::COMPLETED => 'Hoàn thành',
            self::REFUNDED => 'Đã hoàn tiền',
        };
    }
}