<?php

namespace App\Interfaces;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MediaInterface
{
    /**
     * Lấy danh sách media với phân trang, filter và sort.
     *
     * Hỗ trợ filter:
     * - uploader_id : int
     * - date_from   : Y-m-d
     * - date_to     : Y-m-d
     * - mime        : string|array (ví dụ 'image/jpeg' hoặc ['image/png','image/jpeg'])
     * - disk        : string
     * - q           : string (tìm theo path/url/meta.alt/meta.caption)
     * - sort_by     : string ('id','created_at','size','mime')
     * - sort_order  : string ('asc','desc')
     * - per_page    : int
     *
     * @param array $filters
     * @param bool $withTrashed
     * @param bool $onlyTrashed
     * @return LengthAwarePaginator
     */
    public function list(array $filters = [], bool $withTrashed = false, bool $onlyTrashed = false): LengthAwarePaginator;

    /**
     * Tìm media theo ID.
     *
     * @param int $id
     * @param bool $withTrashed
     * @return Media
     */
    public function find(int $id, bool $withTrashed = false): Media;

    /**
     * Upload file & tạo bản ghi Media.
     *
     * @param UploadedFile $file
     * @param int|null $uploadedBy
     * @param array $meta
     * @return Media
     */
    public function upload(UploadedFile $file, ?int $uploadedBy = null, array $meta = []): Media;

    /**
     * Cập nhật thông tin Media (thường là meta).
     *
     * @param int $id
     * @param array $data
     * @return Media
     */
    public function update(int $id, array $data): Media;

    /**
     * Xóa mềm Media.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Khôi phục Media đã xóa mềm.
     *
     * @param int $id
     * @return bool
     */
    public function restore(int $id): bool;

    /**
     * Xóa vĩnh viễn Media.
     *
     * @param int $id
     * @return bool
     */
    public function forceDelete(int $id): bool;


    /**
     * Gán nhiều Media vào một model (Post, Service…) với role tùy chọn.
     *
     * @param Model $model
     * @param array $mediaIds
     * @param string|null $role
     * @return void
     */
    public function attachTo(Model $model, array $mediaIds, ?string $role = null): void;

    /**
     * Gỡ nhiều Media khỏi một model (Post, Service…)
     *
     * @param Model $model
     * @param array $mediaIds
     * @return void
     */
    public function detachFrom(Model $model, array $mediaIds = []): void;

    /**
     * Lấy tất cả Media của một model, có thể lọc theo role.
     *
     * @param Model $model
     * @param string|null $role
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getMediaFor(Model $model, ?string $role = null);
}