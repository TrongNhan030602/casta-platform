<?php

namespace App\Services;

use App\Interfaces\MediaInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Media;

class MediaService
{
    protected MediaInterface $mediaRepository;

    public function __construct(MediaInterface $mediaRepository)
    {
        $this->mediaRepository = $mediaRepository;
    }

    // --- CRUD ---
    public function list(array $filters = [], bool $withTrashed = false, bool $onlyTrashed = false): LengthAwarePaginator
    {
        return $this->mediaRepository->list($filters, $withTrashed, $onlyTrashed);
    }


    public function find(int $id, bool $withTrashed = false): Media
    {
        return $this->mediaRepository->find($id, $withTrashed);
    }

    public function upload(UploadedFile $file, ?int $uploadedBy = null, array $meta = []): Media
    {
        return $this->mediaRepository->upload($file, $uploadedBy, $meta);
    }

    public function update(int $id, array $data): Media
    {
        return $this->mediaRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->mediaRepository->delete($id);
    }

    public function restore(int $id): bool
    {
        return $this->mediaRepository->restore($id);
    }

    public function forceDelete(int $id): bool
    {
        return $this->mediaRepository->forceDelete($id);
    }

    // --- Media relation methods ---
    public function attachTo(Model $model, array $mediaIds, ?string $role = null): void
    {
        $this->mediaRepository->attachTo($model, $mediaIds, $role);
    }

    public function detachFrom(Model $model, array $mediaIds = []): void
    {
        $this->mediaRepository->detachFrom($model, $mediaIds);
    }

    public function getMediaFor(Model $model, ?string $role = null)
    {
        return $this->mediaRepository->getMediaFor($model, $role);
    }

}