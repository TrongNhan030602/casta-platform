<?php

namespace App\Http\Controllers\Api;

use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Support\Facades\Auth;

// Requests
use Illuminate\Database\Eloquent\Model;
use App\Http\Controllers\BaseApiController;
use App\Http\Resources\Media\MediaResource;
use App\Http\Requests\Media\MediaStoreRequest;
use App\Http\Requests\Media\MediaAttachRequest;
use App\Http\Requests\Media\MediaDetachRequest;

// Resource
use App\Http\Requests\Media\MediaFilterRequest;

// Policy
use App\Http\Requests\Media\MediaGetForRequest;
use App\Http\Requests\Media\MediaUpdateRequest;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MediaController extends BaseApiController
{
    use AuthorizesRequests, ValidatesRequests;

    protected MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    // Danh sách Media
    public function index(MediaFilterRequest $request)
    {
        return $this->safe(function () use ($request) {
            $this->authorize('viewAny', Media::class);

            $filters = $request->filters();
            $withTrashed = $filters['with_trashed'] ?? false;
            $onlyTrashed = $filters['only_trashed'] ?? false;

            $paginator = $this->mediaService->list($filters, $withTrashed, $onlyTrashed);

            return response()->json([
                'data' => MediaResource::collection($paginator->items()),
                'meta' => $this->meta($paginator),
            ]);
        });
    }


    // Chi tiết Media
    public function show($id)
    {
        return $this->safe(function () use ($id) {
            // Lấy query param with_trashed nếu có
            $withTrashed = request()->boolean('with_trashed', false);

            $media = $this->mediaService->find($id, $withTrashed);

            $this->authorize('view', $media);

            return response()->json([
                'data' => new MediaResource($media),
            ]);
        });
    }


    // Upload Media
    public function store(MediaStoreRequest $request)
    {
        return $this->safe(function () use ($request) {
            $this->authorize('create', Media::class);

            $media = $this->mediaService->upload(
                $request->file('file'),
                Auth::id(),
                $request->input('meta', [])
            );

            return response()->json([
                'message' => 'Media đã được tải lên thành công.',
                'data' => new MediaResource($media),
            ], 201);
        });
    }

    // Cập nhật Media
    public function update(MediaUpdateRequest $request, $id)
    {
        return $this->safe(function () use ($request, $id) {
            $media = $this->mediaService->find($id);
            $this->authorize('update', $media);

            $updated = $this->mediaService->update($id, $request->only(['meta']));

            return response()->json([
                'message' => 'Cập nhật Media thành công.',
                'data' => new MediaResource($updated),
            ]);
        });
    }

    // Xóa Media
    public function destroy($id)
    {
        return $this->safe(function () use ($id) {
            $media = $this->mediaService->find($id);
            $this->authorize('delete', $media);

            $this->mediaService->delete($id);

            return response()->json(['message' => 'Media đã được xóa.']);
        });
    }

    // Khôi phục Media
    public function restore($id)
    {
        return $this->safe(function () use ($id) {
            $media = $this->mediaService->find($id, true); // withTrashed
            $this->authorize('restore', $media);

            $restored = $this->mediaService->restore($id);

            return response()->json([
                'message' => $restored ? 'Media đã được khôi phục thành công.' : 'Khôi phục Media thất bại.',
            ]);
        });
    }

    // Xóa vĩnh viễn Media
    public function forceDelete($id)
    {
        return $this->safe(function () use ($id) {
            $media = $this->mediaService->find($id, true); // withTrashed
            $this->authorize('forceDelete', $media);

            $deleted = $this->mediaService->forceDelete($id);

            return response()->json([
                'message' => $deleted ? 'Media đã bị xóa vĩnh viễn.' : 'Xóa vĩnh viễn Media thất bại.',
            ]);
        });
    }

    public function attachTo(MediaAttachRequest $request)
    {
        return $this->safe(function () use ($request) {
            $model = $this->resolveModel($request->input('type'), $request->input('id'));
            $mediaIds = (array) $request->input('media_ids');
            $role = $request->input('role', 'featured');

            $this->authorize('update', $model);
            $this->mediaService->attachTo($model, $mediaIds, $role);

            return response()->json(['message' => "Media đã được gán vào {$request->input('type')}"]);
        });
    }

    public function detachFrom(MediaDetachRequest $request)
    {
        return $this->safe(function () use ($request) {
            $model = $this->resolveModel($request->input('type'), $request->input('id'));
            $mediaIds = (array) $request->input('media_ids', []);

            $this->authorize('update', $model);
            $this->mediaService->detachFrom($model, $mediaIds);

            return response()->json(['message' => "Media đã được gỡ khỏi {$request->input('type')}"]);
        });
    }

    public function getMediaFor(MediaGetForRequest $request)
    {
        return $this->safe(function () use ($request) {
            $model = $this->resolveModel(
                $request->input('type'),
                (int) $request->input('id')
            );
            $media = $this->mediaService->getMediaFor($model, $request->input('role'));

            return response()->json([
                'data' => MediaResource::collection($media),
            ]);
        });
    }

    /**
     * Resolve model theo type và id
     */
    protected function resolveModel(string $type, int $id): Model
    {
        return match ($type) {
            'post' => \App\Models\Post::findOrFail($id),
            'service' => \App\Models\Service::findOrFail($id),
            default => throw new \RuntimeException("Model type không hợp lệ"),
        };
    }
}