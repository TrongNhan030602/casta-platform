<?php
namespace App\Enums;

/**
 * Trạng thái bài viết
 */
enum PostStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}