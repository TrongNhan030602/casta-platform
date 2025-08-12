<?php
namespace App\Enums;

enum ExhibitionProductStatus: string
{
    case PENDING = 'pending';      // Doanh nghiệp gửi yêu cầu trưng bày
    case APPROVED = 'approved';    // Quản trị viên duyệt
    case REJECTED = 'rejected';    // Quản trị viên từ chối

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}