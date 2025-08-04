<?php
namespace App\Enums;

enum MediaType: string
{
    case IMAGE = 'image';
    case PANORAMA = 'panorama';
    case VIDEO = 'video';
    case VR_SCENE = 'vr_scene';
    case DOCUMENT = 'document';
    case YOUTUBE = 'youtube';
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}