<?php

namespace App\Http\Controllers\Api;

use App\Models\NewsCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\NewsCategoryService;
use App\Http\Controllers\BaseApiController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use App\Http\Resources\NewsCategory\NewsCategoryResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\NewsCategory\NewsCategoryIndexRequest;
use App\Http\Requests\NewsCategory\StoreNewsCategoryRequest;
use App\Http\Requests\NewsCategory\UpdateNewsCategoryRequest;
use App\Http\Resources\NewsCategory\NewsCategoryTreeResource;

class NewsCategoryController extends BaseApiController
{
    use AuthorizesRequests, ValidatesRequests;

    protected NewsCategoryService $service;

    public function __construct(NewsCategoryService $service)
    {
        $this->service = $service;
    }

    public function index(NewsCategoryIndexRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('viewAny', NewsCategory::class);

            $filters = $request->validated();
            $categories = $this->service->publicSearch($filters);

            return response()->json([
                'data' => NewsCategoryResource::collection($categories->items()),
                'meta' => $this->meta($categories),
            ]);
        });
    }

    public function tree(): JsonResponse
    {
        return $this->safe(function () {
            $this->authorize('viewAny', NewsCategory::class);
            $categories = $this->service->getTree();

            return response()->json([
                'data' => NewsCategoryTreeResource::collection($categories)
            ]);
        });
    }

    public function store(StoreNewsCategoryRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('create', NewsCategory::class);

            $category = $this->service->store($request->validated());

            return response()->json([
                'message' => 'Danh mục tin tức đã được tạo thành công.',
                'data' => new NewsCategoryResource($category),
            ], 201);
        });
    }

    public function show(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $category = $this->service->find($id);
            $this->authorize('view', $category);

            return response()->json(['data' => new NewsCategoryResource($category)]);
        });
    }

    public function update(UpdateNewsCategoryRequest $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $category = $this->service->find($id);
            $this->authorize('update', $category);

            $updated = $this->service->update($id, $request->validated());

            return response()->json([
                'message' => 'Cập nhật danh mục thành công.',
                'data' => new NewsCategoryResource($updated),
            ]);
        });
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $category = $this->service->find($id);
            $this->authorize('delete', $category);

            $cascade = $request->query('cascade') === '1';
            $this->service->delete($id, $cascade);

            return response()->json(['message' => 'Xóa danh mục thành công.']);
        });
    }

    public function restore(Request $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $category = $this->service->find($id);
            $this->authorize('restore', $category);

            $restoreParent = $request->query('restore_parent', '1') !== '0';
            $restored = $this->service->restore($id, $restoreParent);

            if (!$restored) {
                return response()->json(['message' => 'Khôi phục danh mục thất bại.'], 500);
            }

            return response()->json(['message' => 'Danh mục đã được khôi phục thành công.']);
        });
    }

    public function forceDelete(Request $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $category = $this->service->find($id);
            $this->authorize('forceDelete', $category);

            $cascade = $request->query('cascade') === '1';
            $deleted = $this->service->forceDelete($id, $cascade);

            if (!$deleted) {
                return response()->json(['message' => 'Xóa vĩnh viễn danh mục thất bại.'], 500);
            }

            return response()->json(['message' => 'Danh mục đã bị xóa vĩnh viễn.']);
        });
    }
}