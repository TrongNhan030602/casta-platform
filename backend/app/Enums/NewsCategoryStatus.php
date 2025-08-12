<?php
namespace App\Enums;

/**
 * Enum đại diện trạng thái cho danh mục tin tức (NewsCategory).
 *
 * - DRAFT: Bản nháp, chưa công bố
 * - PUBLISHED: Đã được xuất bản, hiển thị công khai
 * - ARCHIVED: Lưu trữ, không hiển thị trên giao diện người dùng
 */
enum NewsCategoryStatus: string
{
    /**
     * Bản nháp, danh mục chưa được công bố
     */
    case DRAFT = 'draft';

    /**
     * Danh mục đã được xuất bản, có thể hiển thị cho người dùng
     */
    case PUBLISHED = 'published';

    /**
     * Danh mục đã được lưu trữ, không hiển thị nhưng vẫn giữ trong CSDL
     */
    case ARCHIVED = 'archived';

    /**
     * Trả về danh sách các giá trị trạng thái (string) dùng cho validate hoặc UI
     *
     * @return string[]
     */
    public static function values(): array
    {
        // Lấy mảng giá trị string của tất cả case enum
        return array_map(fn($case) => $case->value, self::cases());
    }
}