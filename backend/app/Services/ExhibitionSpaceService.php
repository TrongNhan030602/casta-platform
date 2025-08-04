<?php

namespace App\Services;

use App\Models\ExhibitionSpace;
use Illuminate\Support\Collection;
use App\Enums\ExhibitionSpaceStatus;
use App\Interfaces\ExhibitionSpaceInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ExhibitionSpaceService
{
    protected ExhibitionSpaceInterface $spaceRepo;

    public function __construct(ExhibitionSpaceInterface $spaceRepo)
    {
        $this->spaceRepo = $spaceRepo;
    }

    public function listSpaces(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->spaceRepo->getAll($filters, $perPage);
    }

    public function getSpaceById(int $id): ?ExhibitionSpace
    {
        return $this->spaceRepo->findById($id);
    }

    public function getSelectableSpaces(): Collection
    {
        return $this->spaceRepo->getSelectableSpaces();
    }

    public function getSpaceWithRelations(int $id): ?ExhibitionSpace
    {
        return $this->spaceRepo->findWithRelations($id);
    }

    public function create(array $data): ExhibitionSpace
    {
        return $this->spaceRepo->create($data);
    }

    public function update(ExhibitionSpace $space, array $data): ExhibitionSpace
    {
        return $this->spaceRepo->update($space, $data);
    }
    public function updateStatus(ExhibitionSpace $space, ExhibitionSpaceStatus $status): ExhibitionSpace
    {
        $space->update(['status' => $status]);
        return $space;
    }
    public function delete(ExhibitionSpace $space): bool
    {
        return $this->spaceRepo->delete($space);
    }
    public function getOrFail(int $id): ExhibitionSpace
    {
        return $this->spaceRepo->findOrFail($id);
    }
    public function getEnterprisesUsingSpace(int $spaceId): array
    {
        return $this->spaceRepo->getEnterprisesUsingSpace($spaceId);
    }
}