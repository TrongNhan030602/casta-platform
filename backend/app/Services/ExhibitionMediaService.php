<?php
namespace App\Services;

use App\Models\ExhibitionSpace;
use App\Models\ExhibitionMedia;
use App\Interfaces\ExhibitionMediaInterface;

class ExhibitionMediaService
{
    protected ExhibitionMediaInterface $repo;

    public function __construct(ExhibitionMediaInterface $repo)
    {
        $this->repo = $repo;
    }

    public function create(ExhibitionSpace $space, array $data): ExhibitionMedia
    {
        return $this->repo->create($space, $data);
    }

    public function delete(ExhibitionMedia $media): bool
    {
        return $this->repo->delete($media);
    }
}