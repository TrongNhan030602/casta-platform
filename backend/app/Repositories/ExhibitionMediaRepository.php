<?php
namespace App\Repositories;

use App\Models\ExhibitionSpace;
use App\Models\ExhibitionMedia;
use App\Interfaces\ExhibitionMediaInterface;

class ExhibitionMediaRepository implements ExhibitionMediaInterface
{
    public function create(ExhibitionSpace $space, array $data): ExhibitionMedia
    {
        return $space->media()->create($data);
    }

    public function delete(ExhibitionMedia $media): bool
    {
        return $media->delete();
    }
}