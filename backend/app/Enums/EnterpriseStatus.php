<?php

namespace App\Enums;

/**
 * Trạng thái hồ sơ doanh nghiệp
 * - pending: Chờ duyệt
 * - approved: Đã duyệt
 * - rejected: Bị từ chối
 * - suspended: Tạm khóa / đình chỉ
 */
enum EnterpriseStatus: string
{
    case PENDING = 'pending';   // Chờ duyệt
    case APPROVED = 'approved';  // Đã duyệt
    case REJECTED = 'rejected';  // Bị từ chối
    case SUSPENDED = 'suspended'; // Tạm ngưng / khóa

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}