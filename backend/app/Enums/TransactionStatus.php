<?php

namespace App\Enums;

enum TransactionStatus: string
{
    case PENDING = 'pending';
    case SUCCESS = 'success';
    case FAILED = 'failed';
    case CANCELLED = 'cancelled';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Đang xử lý',
            self::SUCCESS => 'Thành công',
            self::FAILED => 'Thất bại',
            self::CANCELLED => 'Đã huỷ',
        };
    }

    public function canTransitionTo(TransactionStatus $target): bool
    {
        return match ($this) {
            self::PENDING => in_array($target, [self::SUCCESS, self::FAILED, self::CANCELLED]),
            self::SUCCESS => false,
            self::FAILED => in_array($target, [self::PENDING, self::CANCELLED]),
            self::CANCELLED => false,
        };
    }
}