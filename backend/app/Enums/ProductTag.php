<?php
namespace App\Enums;

enum ProductTag: string
{
    case HOT = 'hot';
    case NEW = 'new';
    case SALE = 'sale';
    case LIMITED = 'limited';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return [
            self::HOT->value => 'Hot',
            self::NEW ->value => 'Mới',
            self::SALE->value => 'Khuyến mãi',
            self::LIMITED->value => 'Giới hạn',
        ];
    }
}