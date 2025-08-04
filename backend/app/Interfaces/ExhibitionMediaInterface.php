<?php
namespace App\Interfaces;

use App\Models\ExhibitionSpace;
use App\Models\ExhibitionMedia;

interface ExhibitionMediaInterface
{
    public function create(ExhibitionSpace $space, array $data): ExhibitionMedia;
    public function delete(ExhibitionMedia $media): bool;
}