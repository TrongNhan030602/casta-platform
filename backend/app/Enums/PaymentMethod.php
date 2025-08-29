<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case COD = 'cod';
    case BANK_TRANSFER = 'bank_transfer';
    case MOMO = 'momo';
    case ZALOPAY = 'zalopay';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function isOnline(): bool
    {
        return in_array($this, [self::BANK_TRANSFER, self::MOMO, self::ZALOPAY], true);
    }

    public function isCOD(): bool
    {
        return $this === self::COD;
    }
}