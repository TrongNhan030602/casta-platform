<?php

namespace App\Http\Controllers\Api;

use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\ServiceCategoryService;
use App\Http\Controllers\BaseApiController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use App\Http\Resources\ServiceCategory\ServiceCategoryResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\ServiceCategory\ServiceCategoryIndexRequest;
use App\Http\Requests\ServiceCategory\StoreServiceCategoryRequest;
use App\Http\Requests\ServiceCategory\UpdateServiceCategoryRequest;
use App\Http\Resources\ServiceCategory\ServiceCategoryTreeResource;

class ServiceCategoryController extends BaseApiController
{
    use AuthorizesRequests, ValidatesRequests;

    protected ServiceCategoryService $service;

    public function __construct(ServiceCategoryService $service)
    {
        $this->service = $service;
    }

    public function index(ServiceCategoryIndexRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('viewAny', ServiceCategory::class);

            $filters = $request->validated();
            $categories = $this->service->publicSearch($filters);

            return response()->json([
                'data' => ServiceCategoryResource::collection($categories->items()),
                'meta' => $this->meta($categories),
            ]);
        });
    }

    public function tree(): JsonResponse
    {
        return $this->safe(function () {
            $this->authorize('viewAny', ServiceCategory::class);
            $categories = $this->service->getTree();

            return response()->json([
                'data' => ServiceCategoryTreeResource::collection($categories)
            ]);
        });
    }

    public function store(StoreServiceCategoryRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('create', ServiceCategory::class);

            $category = $this->service->store($request->validated());

            return response()->json([
                'message' => 'Danh mục dịch vụ đã được tạo thành công.',
                'data' => new ServiceCategoryResource($category),
            ], 201);
        });
    }

    public function show(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $category = $this->service->find($id);
            $this->authorize('view', $category);

            return response()->json(['data' => new ServiceCategoryResource($category)]);
        });
    }

    public function update(UpdateServiceCategoryRequest $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $category = $this->service->find($id);
            $this->authorize('update', $category);

            $updated = $this->service->update($id, $request->validated());

            return response()->json([
                'message' => 'Cập nhật danh mục dịch vụ thành công.',
                'data' => new ServiceCategoryResource($updated),
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

            return response()->json(['message' => 'Xóa danh mục dịch vụ thành công.']);
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
                return response()->json(['message' => 'Khôi phục danh mục dịch vụ thất bại.'], 500);
            }

            return response()->json(['message' => 'Danh mục dịch vụ đã được khôi phục thành công.']);
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
                return response()->json(['message' => 'Xóa vĩnh viễn danh mục dịch vụ thất bại.'], 500);
            }

            return response()->json(['message' => 'Danh mục dịch vụ đã bị xóa vĩnh viễn.']);
        });
    }
}