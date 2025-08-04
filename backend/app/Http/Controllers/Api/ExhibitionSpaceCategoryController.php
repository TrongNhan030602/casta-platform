<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use App\Models\ExhibitionSpaceCategory;
use App\Http\Controllers\BaseApiController;
use App\Services\ExhibitionSpaceCategoryService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\ExhibitionSpaceCategory\ExhibitionSpaceCategoryResource;
use App\Http\Requests\ExhibitionSpaceCategory\IndexExhibitionSpaceCategoryRequest;
use App\Http\Requests\ExhibitionSpaceCategory\StoreExhibitionSpaceCategoryRequest;
use App\Http\Requests\ExhibitionSpaceCategory\UpdateExhibitionSpaceCategoryRequest;
use App\Http\Resources\ExhibitionSpaceCategory\ExhibitionSpaceCategoryTreeResource;

class ExhibitionSpaceCategoryController extends BaseApiController
{
    use AuthorizesRequests;
    protected ExhibitionSpaceCategoryService $service;

    public function __construct(ExhibitionSpaceCategoryService $service)
    {
        $this->service = $service;
    }

    public function index(IndexExhibitionSpaceCategoryRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $categories = $this->service->getAll($request->validated());

            return response()->json([
                'data' => ExhibitionSpaceCategoryResource::collection($categories),
                'meta' => $this->meta($categories),
            ]);
        });
    }

    public function store(StoreExhibitionSpaceCategoryRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('create', ExhibitionSpaceCategory::class);
            $category = $this->service->create($request->validated());

            return response()->json([
                'message' => 'Tạo danh mục thành công.',
                'data' => new ExhibitionSpaceCategoryResource($category)
            ]);
        });
    }
    public function show(ExhibitionSpaceCategory $category): JsonResponse
    {
        return $this->safe(function () use ($category) {
            $this->authorize('view', $category);

            return response()->json([
                'data' => new ExhibitionSpaceCategoryResource($category)
            ]);
        });
    }

    public function update(UpdateExhibitionSpaceCategoryRequest $request, ExhibitionSpaceCategory $category): JsonResponse
    {
        return $this->safe(function () use ($request, $category) {
            $this->authorize('update', $category);
            $updated = $this->service->update($category, $request->validated());

            return response()->json([
                'message' => 'Cập nhật danh mục thành công.',
                'data' => new ExhibitionSpaceCategoryResource($updated)
            ]);
        });
    }

    public function destroy(ExhibitionSpaceCategory $category): JsonResponse
    {
        return $this->safe(function () use ($category) {
            $this->authorize('delete', $category);
            $this->service->delete($category);

            return response()->json(['message' => 'Đã xóa danh mục.']);
        });
    }

    public function tree(): JsonResponse
    {
        return $this->safe(function () {
            $this->authorize('viewAny', ExhibitionSpaceCategory::class);
            $categories = $this->service->getTree();

            return response()->json([
                'data' => ExhibitionSpaceCategoryTreeResource::collection($categories)
            ]);
        });
    }
}