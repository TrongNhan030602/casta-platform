<?php
namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\BaseApiController;
use App\Http\Resources\ProductCategory\CategoryResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\ProductCategory\StoreCategoryRequest;
use App\Http\Requests\ProductCategory\CategoryFilterRequest;
use App\Http\Requests\ProductCategory\UpdateCategoryRequest;
use App\Http\Resources\ProductCategory\CategoryTreeResource;

class CategoryController extends BaseApiController
{
    use AuthorizesRequests;
    protected CategoryService $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    public function index(CategoryFilterRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('viewAny', Category::class);

            $perPage = $request->input('per_page', 15);
            $categories = $this->service->getAll($perPage);

            return response()->json([
                'data' => CategoryResource::collection($categories),
                'meta' => $this->meta($categories),
            ]);
        });
    }
    public function tree(): JsonResponse
    {
        return $this->safe(function () {
            $this->authorize('viewAny', Category::class);

            $filters = [];

            // Doanh nghiệp chỉ thấy danh mục đang hoạt động
            if (auth()->user()->isEnterprise()) {
                $filters['is_active'] = 1;
            }

            $categories = $this->service->getTree($filters);

            return response()->json([
                'data' => CategoryTreeResource::collection($categories),
            ]);
        });
    }


    public function store(StoreCategoryRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('create', Category::class);
            $category = $this->service->create($request->validated());
            $category->load('parent');
            return response()->json([
                'message' => 'Danh mục đã được tạo.',
                'data' => new CategoryResource($category)
            ], 201);
        });
    }
    public function show(Category $category): JsonResponse
    {
        return $this->safe(function () use ($category) {
            $this->authorize('view', $category);
            $category->load('parent');
            return response()->json([
                'data' => new CategoryResource($category),
            ]);
        });
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        return $this->safe(function () use ($request, $category) {
            $this->authorize('update', $category);
            $category = $this->service->update($category, $request->validated());
            $category->load('parent');

            return response()->json([
                'message' => 'Danh mục đã được cập nhật.',
                'data' => new CategoryResource($category)
            ]);
        });
    }

    public function destroy(Category $category): JsonResponse
    {
        return $this->safe(function () use ($category) {
            $this->authorize('delete', $category);
            $this->service->delete($category);

            return response()->json(['message' => 'Danh mục đã được xoá.']);
        });
    }



}