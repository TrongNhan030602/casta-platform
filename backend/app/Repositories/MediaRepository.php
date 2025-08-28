<?php

namespace App\Repositories;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use App\Interfaces\MediaInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MediaRepository implements MediaInterface
{
    /**
     * Lấy danh sách media với filter, sort và phân trang
     */
    public function list(array $filters = [], bool $withTrashed = false, bool $onlyTrashed = false): LengthAwarePaginator
    {
        $query = Media::query();

        // Soft delete
        if ($onlyTrashed) {
            $query->onlyTrashed();
        } elseif ($withTrashed) {
            $query->withTrashed();
        }

        // Filters
        if (!empty($filters['uploader_id'])) {
            $query->where('uploaded_by', $filters['uploader_id']);
        }
        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }
        if (!empty($filters['mime'])) {
            $mimes = is_array($filters['mime']) ? $filters['mime'] : [$filters['mime']];
            $query->whereIn('mime', $mimes);
        }
        if (!empty($filters['disk'])) {
            $query->where('disk', $filters['disk']);
        }
        if (!empty($filters['q'])) {
            $q = $filters['q'];
            $query->where(function ($sub) use ($q) {
                $sub->where('path', 'like', "%{$q}%")
                    ->orWhere('url', 'like', "%{$q}%")
                    ->orWhere('meta->alt', 'like', "%{$q}%")
                    ->orWhere('meta->caption', 'like', "%{$q}%");
            });
        }

        // Sort
        $validSortBy = ['id', 'created_at', 'size', 'mime'];
        $sortBy = in_array($filters['sort_by'] ?? '', $validSortBy) ? $filters['sort_by'] : 'created_at';
        $sortOrder = in_array(strtolower($filters['sort_order'] ?? ''), ['asc', 'desc']) ? $filters['sort_order'] : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Quan hệ nếu cần
        $query->with(['uploader', 'posts', 'services']);

        // Phân trang
        $perPage = $filters['per_page'] ?? 15;
        return $query->paginate($perPage);
    }


    public function find(int $id, bool $withTrashed = false): Media
    {
        $query = Media::query();
        if ($withTrashed) {
            $query->withTrashed();
        }
        return $query->findOrFail($id);
    }


    public function upload(UploadedFile $file, ?int $uploadedBy = null, array $meta = []): Media
    {
        $disk = 'public';

        // Xác định loại file dựa vào MIME
        $mime = $file->getMimeType();
        if (str_starts_with($mime, 'image/')) {
            $subFolder = 'images';
        } elseif (str_starts_with($mime, 'video/')) {
            $subFolder = 'videos';
        } elseif (str_starts_with($mime, 'audio/')) {
            $subFolder = 'audio';
        } else {
            $subFolder = 'documents';
        }

        // Thư mục lưu: media/{subFolder}/
        $folder = 'media/' . $subFolder;

        // Lấy tên gốc và extension
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();

        // Loại bỏ dấu tiếng Việt, ký tự đặc biệt, khoảng trắng
        $sanitized = preg_replace('/[^A-Za-z0-9\-]/', '-', $this->removeVietnameseAccents($originalName));
        $sanitized = preg_replace('/-+/', '-', $sanitized); // gộp nhiều dấu '-' liên tiếp
        $sanitized = trim($sanitized, '-');

        // Tạo tên file cuối cùng
        $filename = $sanitized . '_' . time() . '.' . $extension;

        // Lưu file vào disk với tên mới
        $path = $file->storeAs($folder, $filename, $disk);

        /** @var \Illuminate\Filesystem\FilesystemAdapter $diskAdapter */
        $diskAdapter = Storage::disk($disk);

        return Media::create([
            'disk' => $disk,
            'path' => $path,
            'url' => $diskAdapter->url($path),
            'mime' => $mime,
            'size' => $file->getSize(),
            'meta' => $meta,
            'uploaded_by' => $uploadedBy,
        ]);
    }

    /**
     * Chuyển tên tiếng Việt có dấu về không dấu
     */
    protected function removeVietnameseAccents(string $str): string
    {
        $unicode = [
            'a' => 'á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ',
            'A' => 'Á|À|Ả|Ã|Ạ|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',
            'd' => 'đ',
            'D' => 'Đ',
            'e' => 'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ',
            'E' => 'É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
            'i' => 'í|ì|ỉ|ĩ|ị',
            'I' => 'Í|Ì|Ỉ|Ĩ|Ị',
            'o' => 'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ',
            'O' => 'Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ',
            'u' => 'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự',
            'U' => 'Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự',
            'y' => 'ý|ỳ|ỷ|ỹ|ỵ',
            'Y' => 'Ý|Ỳ|Ỷ|Ỹ|Ỵ',
        ];
        foreach ($unicode as $nonUnicode => $uni) {
            $str = preg_replace("/($uni)/i", $nonUnicode, $str);
        }
        return $str;
    }





    public function update(int $id, array $data): Media
    {
        $media = $this->find($id, true);
        $media->update($data);
        return $media;
    }

    public function delete(int $id): bool
    {
        return $this->find($id)->delete();
    }

    public function restore(int $id): bool
    {
        return $this->find($id, true)->restore();
    }

    public function forceDelete(int $id): bool
    {
        $media = $this->find($id, true);

        // Chỉ xóa nếu đã bị soft delete
        if (!$media->trashed()) {
            throw new \Exception('Chỉ được xóa vĩnh viễn khi media đã bị xóa mềm trước đó.');
        }

        // Xóa file vật lý nếu tồn tại
        if (Storage::disk($media->disk)->exists($media->path)) {
            Storage::disk($media->disk)->delete($media->path);
        }

        return $media->forceDelete();
    }


    public function attachTo(Model $model, array $mediaIds, ?string $role = null): void
    {
        $existingMediaIds = Media::withTrashed()
            ->whereIn('id', $mediaIds)
            ->pluck('id')
            ->toArray();

        if (!empty($existingMediaIds)) {
            DB::transaction(function () use ($model, $existingMediaIds, $role) {
                $pivotData = $role ? array_fill_keys($existingMediaIds, ['role' => $role]) : [];
                $model->media()->sync($pivotData);
            });
        }
    }

    public function detachFrom(Model $model, array $mediaIds = []): void
    {
        DB::transaction(function () use ($model, $mediaIds) {
            if (empty($mediaIds)) {
                $model->media()->detach();
            } else {
                $existingMediaIds = Media::withTrashed()
                    ->whereIn('id', $mediaIds)
                    ->pluck('id')
                    ->toArray();
                if (!empty($existingMediaIds)) {
                    $model->media()->detach($existingMediaIds);
                }
            }
        });
    }

    public function getMediaFor(Model $model, ?string $role = null)
    {
        $query = $model->media();
        if ($role) {
            $query->wherePivot('role', $role);
        }
        return $query->get();
    }

}