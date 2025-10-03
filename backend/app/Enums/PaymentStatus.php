<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case UNPAID = 'unpaid';
    case PAID = 'paid';
    case PENDING = 'pending';
    case REFUNDED = 'refunded';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::UNPAID => 'Chưa thanh toán',
            self::PAID => 'Đã thanh toán',
            self::PENDING => 'Đang xử lý',
            self::REFUNDED => 'Đã hoàn tiền',
        };
    }
}