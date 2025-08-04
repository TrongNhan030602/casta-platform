<?php

namespace App\Enums;

enum FeedbackType: string
{
    case PRODUCT = 'product';        // Phản hồi về sản phẩm
    case ENTERPRISE = 'enterprise';  // Phản hồi về doanh nghiệp
    case SPACE = 'space';            // Phản hồi về không gian trưng bày
    case SERVICE = 'service';        // Phản hồi về dịch vụ

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}