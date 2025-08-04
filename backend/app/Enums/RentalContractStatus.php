<?php
namespace App\Enums;

enum RentalContractStatus: string
{
    case PENDING = 'pending';        // Chờ duyệt
    case APPROVED = 'approved';      // Đã được duyệt
    case CANCELLED = 'cancelled';    // Bị hủy bởi DN
    case EXPIRED = 'expired';        // Hết hạn hợp đồng
    case REJECTED = 'rejected';      // Bị từ chối bởi quản trị viên

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}