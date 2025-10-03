<?php

namespace App\Enums;

enum TransactionMethod: string
{
    case BANK_TRANSFER = 'bank_transfer';
    case COD = 'cod';
    case ONLINE = 'online';
    case REFUND = 'refund';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::BANK_TRANSFER => 'Chuyển khoản',
            self::COD => 'Thanh toán khi nhận hàng',
            self::ONLINE => 'Thanh toán online',
            self::REFUND => 'Hoàn tiền',
        };
    }
}