<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseApiController;
use App\Services\TagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Tag\StoreTagRequest;
use App\Http\Requests\Tag\UpdateTagRequest;
use App\Http\Requests\Tag\AttachTagsRequest;
use App\Http\Resources\Tag\TagResource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TagController extends BaseApiController
{
    use AuthorizesRequests;

    protected TagService $service;

    public function __construct(TagService $service)
    {
        $this->service = $service;
    }

    /**
     * Danh sách tags
     */
    public function index(Request $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('viewAny', \App\Models\Tag::class);

            $withTrashed = (bool) $request->query('with_trashed', false);
            $onlyTrashed = (bool) $request->query('only_trashed', false);

            $tags = $this->service->list($withTrashed, $onlyTrashed);
            return response()->json(['data' => TagResource::collection($tags)]);
        });
    }

    /**
     * Tạo mới tag
     */
    public function store(StoreTagRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('create', \App\Models\Tag::class);

            $tag = $this->service->create($request->validated());
            return response()->json([
                'message' => 'Tag đã được tạo',
                'data' => new TagResource($tag)
            ], 201);
        });
    }

    /**
     * Xem chi tiết tag
     */
    public function show(int $id, Request $request): JsonResponse
    {
        return $this->safe(function () use ($id, $request) {
            $withTrashed = (bool) $request->query('with_trashed', false);

            $tag = $this->service->find($id, $withTrashed);
            $this->authorize('view', $tag);

            return response()->json(['data' => new TagResource($tag)]);
        });
    }

    /**
     * Cập nhật tag
     */
    public function update(UpdateTagRequest $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $tag = $this->service->find($id, true); // cho phép update nếu đã xóa mềm
            $this->authorize('update', $tag);

            $tag = $this->service->update($id, $request->validated());
            return response()->json([
                'message' => 'Tag đã cập nhật',
                'data' => new TagResource($tag)
            ]);
        });
    }

    /**
     * Xóa mềm tag
     */
    public function destroy(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $tag = $this->service->find($id);
            $this->authorize('delete', $tag);

            $this->service->delete($id);
            return response()->json(['message' => 'Tag đã xóa (soft delete)']);
        });
    }

    /**
     * Khôi phục tag đã xóa mềm
     */
    public function restore(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $tag = $this->service->find($id, true);
            $this->authorize('restore', $tag);

            $this->service->restore($id);
            return response()->json(['message' => 'Tag đã được khôi phục']);
        });
    }

    /**
     * Xóa vĩnh viễn tag
     */
    public function forceDelete(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $tag = $this->service->find($id, true);
            $this->authorize('forceDelete', $tag);

            $this->service->forceDelete($id);
            return response()->json(['message' => 'Tag đã bị xóa vĩnh viễn']);
        });
    }

    /**
     * Gắn tags vào model bất kỳ
     */
    public function attach(AttachTagsRequest $request, string $type, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $type, $id) {
            $model = $this->resolveModel($type, $id);
            $this->authorize('update', $model);

            $this->service->attachTags($model, $request->input('tags'));
            return response()->json(['message' => "Tags đã được gắn vào {$type}"]);
        });
    }

    /**
     * Gỡ tags khỏi model bất kỳ
     */
    public function detach(AttachTagsRequest $request, string $type, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $type, $id) {
            $model = $this->resolveModel($type, $id);
            $this->authorize('update', $model);

            $this->service->detachTags($model, $request->input('tags'));
            return response()->json(['message' => "Tags đã được gỡ khỏi {$type}"]);
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