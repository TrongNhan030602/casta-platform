<?php

namespace App\Interfaces;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TagInterface
{
    /**
     * Lấy danh sách tags
     *
     * @param bool $withTrashed  Lấy cả bản ghi đã xóa mềm
     * @param bool $onlyTrashed  Chỉ lấy bản ghi đã xóa mềm
     * @return Collection|Tag[]
     */
    public function list(array $filters = [], bool $withTrashed = false, bool $onlyTrashed = false): LengthAwarePaginator;


    /**
     * Tìm tag theo ID
     *
     * @param int $id
     * @param bool $withTrashed  Có lấy cả bản ghi đã xóa mềm không
     * @return Tag
     */
    public function find(int $id, bool $withTrashed = false): Tag;

    /**
     * Tạo mới tag
     */
    public function store(array $data): Tag;

    /**
     * Cập nhật tag
     */
    public function update(int $id, array $data): Tag;

    /**
     * Xóa mềm tag
     */
    public function delete(int $id): bool;

    /**
     * Khôi phục tag đã bị xóa mềm
     */
    public function restore(int $id): bool;

    /**
     * Xóa vĩnh viễn tag
     */
    public function forceDelete(int $id): bool;

    /**
     * Gắn tags cho model
     */
    public function attachTags(Model $model, array $tagIds): void;

    /**
     * Gỡ tags khỏi model
     */
    public function detachTags(Model $model, array $tagIds = []): void;
}