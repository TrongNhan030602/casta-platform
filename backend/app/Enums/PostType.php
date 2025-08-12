<?php
namespace App\Enums;

/**
 * Loại bài viết (Post type)
 */
enum PostType: string
{
    case NEWS = 'news';
    case EVENT = 'event';

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}