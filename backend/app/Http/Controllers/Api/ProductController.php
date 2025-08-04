<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Enums\ProductStatus;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\BaseApiController;
use App\Http\Resources\Product\ProductResource;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\Product\ProductCompactResource;
use App\Http\Requests\Product\AdminStoreProductRequest;
use Illuminate\Foundation\Validation\ValidatesRequests;
use App\Http\Requests\Product\AdminUpdateProductRequest;
use App\Http\Requests\Product\PublicSearchProductRequest;
use App\Http\Requests\Product\UpdateProductStatusRequest;
use App\Http\Requests\ProductStockLog\AdjustStockRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\ProductStockLog\ProductStockLogResource;
use App\Http\Requests\ProductStockLog\GetProductStockLogsRequest;

class ProductController extends BaseApiController
{
    use AuthorizesRequests, ValidatesRequests;

    protected ProductService $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }
    public function index(PublicSearchProductRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $products = $this->service->publicSearch($request->validated());

            return response()->json([
                'data' => ProductResource::collection($products),
                'meta' => $this->meta($products),
            ]);
        });
    }

    public function getCompactByEnterprise(): JsonResponse
    {
        return $this->safe(function () {
            $user = auth()->user();

            $enterpriseId = $user->enterprise_id ?? $user->enterprise->id ?? $user->real_enterprise_id ?? null;
            if (!$enterpriseId) {
                return response()->json(['message' => 'Không xác định được doanh nghiệp của bạn.'], 403);
            }

            $products = $this->service->getCompactByEnterprise($enterpriseId);

            return response()->json([
                'data' => ProductCompactResource::collection($products)
            ]);
        });
    }


    public function store(StoreProductRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('create', Product::class);

            $data = $request->validated();
            $data['enterprise_id'] = auth()->user()->real_enterprise_id;

            $product = $this->service->create($data);

            return response()->json([
                'message' => $product->status === ProductStatus::DRAFT
                    ? 'Sản phẩm đã được lưu dưới dạng bản nháp.'
                    : 'Sản phẩm đã được tạo và chờ duyệt.',

                'data' => new ProductResource($product)
            ], 201);
        });
    }

    public function submit(Product $product): JsonResponse
    {
        return $this->safe(function () use ($product) {
            $this->authorize('submit', $product);

            $product = $this->service->submitForApproval($product);

            return response()->json([
                'message' => 'Sản phẩm đã được gửi duyệt.',
                'data' => new ProductResource($product),
            ]);
        });
    }

    public function updateStatus(UpdateProductStatusRequest $request, $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $product = $this->service->findOrFail($id);

            $this->authorize('approve', $product);

            $this->service->updateStatus($product, $request->validated());

            return response()->json([
                'message' => 'Đã cập nhật trạng thái sản phẩm.',
            ]);
        });
    }
    public function updateOwnStatus(UpdateProductStatusRequest $request, Product $product): JsonResponse
    {
        return $this->safe(function () use ($request, $product) {
            $user = auth()->user();

            // Kiểm tra quyền sở hữu
            if (!$user->isEnterprise() || $product->enterprise_id !== $user->real_enterprise_id) {
                abort(403, 'Bạn không có quyền thay đổi trạng thái sản phẩm này.');
            }

            $this->service->updateEnterpriseStatus($product, $request->validated());

            return response()->json([
                'message' => 'Đã cập nhật trạng thái sản phẩm.',
            ]);
        });
    }



    public function update(UpdateProductRequest $request, $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $product = $this->service->findOrFail($id);

            $this->authorize('update', $product);

            $data = $request->validated();

            $updated = $this->service->update($product, $data);

            return response()->json([
                'message' => auth()->user()->isEnterprise()
                    ? 'Sản phẩm đã được cập nhật và chuyển về trạng thái chờ duyệt.'
                    : 'Sản phẩm đã được cập nhật thành công.',

                'data' => new ProductResource($updated),
            ]);
        });
    }


    public function destroy($id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $product = $this->service->findOrFail($id);

            // Phân quyền delete
            if (auth()->user()->isSystemUser()) {
                $this->authorize('adminDelete', $product);
            } else {
                $this->authorize('delete', $product);
            }

            $force = request()->boolean('force');

            $this->service->delete($product, $force);

            return response()->json([
                'message' => $force ? 'Đã xoá vĩnh viễn sản phẩm.' : 'Đã xoá sản phẩm (mềm).',
            ]);
        });
    }
    public function restore(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $product = $this->service->restore($id);

            return response()->json([
                'message' => 'Khôi phục sản phẩm thành công.',
                'data' => new ProductResource($product),
            ]);
        });
    }





    public function adminStore(AdminStoreProductRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('adminStore', Product::class);

            $data = $request->validated();

            $product = $this->service->adminCreate($data);

            return response()->json([
                'message' => 'Sản phẩm đã được tạo và công khai.',
                'data' => new ProductResource($product),
            ], 201);
        });
    }

    public function adminUpdate(AdminUpdateProductRequest $request, $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $product = $this->service->findOrFail($id);

            $this->authorize('adminUpdate', $product);

            $updated = $this->service->adminUpdate($product, $request->validated());

            return response()->json([
                'message' => 'Sản phẩm đã được cập nhật thành công.',
                'data' => new ProductResource($updated),
            ]);
        });
    }


    public function adjustStock(AdjustStockRequest $request, $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $product = $this->service->findOrFail($id);
            $this->authorize('adjustStock', $product);

            $log = $this->service->adjustStock($product, $request->validated());

            return response()->json([
                'message' => 'Tồn kho đã được cập nhật.',
                'data' => new ProductStockLogResource($log),
            ]);
        });
    }

    public function stockLogs(GetProductStockLogsRequest $request, $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $product = $this->service->findOrFail($id);

            $this->authorize('viewStockLogs', $product);

            // Dữ liệu đã được validate
            $filters = $request->only(['type', 'keyword', 'sort_by', 'sort_order']);
            $perPage = (int) $request->input('per_page', 15);

            $logs = $this->service->getStockLogs($product, $filters, $perPage);

            return response()->json([
                'data' => ProductStockLogResource::collection($logs),
                'meta' => $this->meta($logs),
            ]);
        });
    }

    public function show($id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $product = $this->service->findOrFail($id);

            $this->service->increaseViews($product); // 👈 gọi hàm tăng views

            return response()->json([
                'data' => new ProductResource($product),
            ]);
        });
    }
    public function getById($id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $product = $this->service->findOrFail($id);


            return response()->json([
                'data' => new ProductResource($product),
            ]);
        });
    }

}