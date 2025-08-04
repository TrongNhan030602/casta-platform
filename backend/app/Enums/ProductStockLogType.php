<?php

namespace App\Enums;
enum ProductStockLogType: string
{
    case IMPORT = 'import';                   // Nhập hàng từ NCC → Tăng kho
    case SALE = 'sale';                       // Bán hàng → Giảm kho
    case RETURN_SALE = 'return_sale';         // Khách trả hàng → Tăng kho
    case RETURN_IMPORT = 'return_import';     // Trả hàng lại cho NCC → Giảm kho
    case ADJUST_INCREASE = 'adjust_increase'; // Điều chỉnh kho tăng
    case ADJUST_DECREASE = 'adjust_decrease'; // Điều chỉnh kho giảm

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return self::labels()[$this->value] ?? $this->value;
    }

    public static function labels(): array
    {
        return [
            self::IMPORT->value => 'Nhập hàng',
            self::SALE->value => 'Bán hàng',
            self::RETURN_SALE->value => 'Khách trả hàng',
            self::RETURN_IMPORT->value => 'Trả hàng cho NCC',
            self::ADJUST_INCREASE->value => 'Điều chỉnh kho (tăng)',
            self::ADJUST_DECREASE->value => 'Điều chỉnh kho (giảm)',
        ];
    }

    public function isImport(): bool
    {
        return in_array($this, [
            self::IMPORT,
            self::RETURN_SALE,
            self::ADJUST_INCREASE
        ]);
    }

    public function isExport(): bool
    {
        return in_array($this, [
            self::SALE,
            self::RETURN_IMPORT,
            self::ADJUST_DECREASE
        ]);
    }

    public static function casesFor(callable $filter): array
    {
        return array_map(
            fn($case) => $case->value,
            array_filter(self::cases(), $filter)
        );
    }
    public function affectCostByDefault(): bool
    {
        return in_array($this, [
            self::IMPORT,
            self::RETURN_SALE,
        ]);
    }

}