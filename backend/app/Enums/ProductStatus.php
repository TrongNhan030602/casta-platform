<?php

namespace App\Enums;

enum ProductStatus: string
{
    case DRAFT = 'draft';            // Bản nháp - DN đang nhập liệu
    case PENDING = 'pending';        // Chờ duyệt sản phẩm
    case PUBLISHED = 'published';    // Sản phẩm đã được công khai
    case REJECTED = 'rejected';      // Sản phẩm bị từ chối
    case DISABLED = 'disabled';      // Sản phẩm bị ẩn (tạm thời)

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Bản nháp',
            self::PENDING => 'Chờ duyệt',
            self::PUBLISHED => 'Đã công khai',
            self::REJECTED => 'Bị từ chối',
            self::DISABLED => 'Ngừng hiển thị',
        };
    }

    public function canTransitionTo(ProductStatus $target): bool
    {
        return match ($this) {
            self::DRAFT => in_array($target, [self::PENDING]),
            self::PENDING => in_array($target, [self::DRAFT, self::PUBLISHED, self::REJECTED]),
            self::REJECTED => in_array($target, [self::DRAFT, self::PENDING]),
            self::DISABLED => in_array($target, [self::DRAFT, self::PENDING, self::PUBLISHED]),

            self::PUBLISHED => in_array($target, [self::DISABLED, self::PENDING]),
            default => false,
        };
    }


}