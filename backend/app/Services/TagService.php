<?php

namespace App\Services;

use App\Models\Tag;
use App\Interfaces\TagInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TagService
{
    protected TagInterface $repo;

    public function __construct(TagInterface $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Lấy danh sách tag
     *
     * @param array $filters
     * @param bool $withTrashed
     * @param bool $onlyTrashed
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function list(array $filters = [], bool $withTrashed = false, bool $onlyTrashed = false): LengthAwarePaginator
    {
        /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator $paginator */
        $paginator = $this->repo->list($filters, $withTrashed, $onlyTrashed);

        return $paginator;
    }


    /**
     * Tìm tag theo ID
     *
     * @param int $id
     * @param bool $withTrashed
     */
    public function find(int $id, bool $withTrashed = false): Tag
    {
        return $this->repo->find($id, $withTrashed);
    }

    /**
     * Tạo mới tag
     */
    public function create(array $data): Tag
    {
        return $this->repo->store($data);
    }

    /**
     * Cập nhật tag
     */
    public function update(int $id, array $data): Tag
    {
        return $this->repo->update($id, $data);
    }

    /**
     * Xóa mềm tag
     */
    public function delete(int $id): bool
    {
        return $this->repo->delete($id);
    }

    /**
     * Khôi phục tag đã bị xóa mềm
     */
    public function restore(int $id): bool
    {
        return $this->repo->restore($id);
    }

    /**
     * Xóa vĩnh viễn tag
     */
    public function forceDelete(int $id): bool
    {
        return $this->repo->forceDelete($id);
    }

    /**
     * Gắn tags cho model
     */
    public function attachTags(Model $model, array $tagIds): void
    {
        $this->repo->attachTags($model, $tagIds);
    }

    /**
     * Gỡ tags khỏi model
     */
    public function detachTags(Model $model, array $tagIds = []): void
    {
        $this->repo->detachTags($model, $tagIds);
    }
}