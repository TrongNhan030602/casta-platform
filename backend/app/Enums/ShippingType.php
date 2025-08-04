<?php

namespace App\Enums;

enum ShippingType: string
{
    case CALCULATED = 'calculated'; // Tính phí theo cân nặng / kích thước
    case FREE = 'free';             // Miễn phí vận chuyển
    case PICKUP = 'pickup';         // Tự đến lấy hàng

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return [
            self::CALCULATED->value => 'Tính phí vận chuyển',
            self::FREE->value => 'Miễn phí vận chuyển',
            self::PICKUP->value => 'Đến lấy hàng',
        ];
    }
}