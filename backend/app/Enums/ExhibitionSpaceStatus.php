<?php
namespace App\Enums;

enum ExhibitionSpaceStatus: string
{
    case AVAILABLE = 'available';     // Không gian trống
    case BOOKED = 'booked';           // Đã được đặt thuê
    case MAINTENANCE = 'maintenance'; // Đang bảo trì

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}