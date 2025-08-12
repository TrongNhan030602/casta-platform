<?php
namespace App\Enums;

/**
 * Enum trạng thái cho danh mục dịch vụ (ServiceCategory)
 *
 * - DRAFT: Bản nháp
 * - PUBLISHED: Đã xuất bản
 * - ARCHIVED: Đã lưu trữ
 */
enum ServiceCategoryStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';

    /**
     * Trả về mảng các giá trị string trạng thái để validate hoặc UI
     *
     * @return string[]
     */
    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}