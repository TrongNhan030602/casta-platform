<?php

namespace App\Enums;

enum FeedbackStatus: string
{
    case NEW = 'new';
    case REVIEWED = 'reviewed';
    case RESOLVED = 'resolved';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return [
            self::NEW ->value => 'Chưa xử lý',
            self::REVIEWED->value => 'Đã xem',
            self::RESOLVED->value => 'Đã phản hồi',
        ];
    }

    // Helper
    public function isReviewedOrResolved(): bool
    {
        return in_array($this, [self::REVIEWED, self::RESOLVED]);
    }
}