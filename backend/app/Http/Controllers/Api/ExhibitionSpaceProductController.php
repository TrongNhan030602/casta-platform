<?php

namespace App\Http\Controllers\Api;

use App\Models\RentalContract;
use Illuminate\Http\JsonResponse;
use App\Models\ExhibitionSpaceProduct;
use App\Http\Controllers\BaseApiController;
use App\Services\ExhibitionSpaceProductService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\ExhibitionSpaceProduct\ExhibitionSpaceProductResource;
use App\Http\Requests\ExhibitionSpaceProduct\StoreExhibitionSpaceProductRequest;
use App\Http\Requests\ExhibitionSpaceProduct\FilterExhibitionSpaceProductRequest;
use App\Http\Requests\ExhibitionSpaceProduct\UpdateExhibitionSpaceProductRequest;
use App\Http\Requests\ExhibitionSpaceProduct\ApproveExhibitionSpaceProductRequest;
use App\Http\Resources\ExhibitionSpaceProduct\AdminExhibitionSpaceProductResource;

class ExhibitionSpaceProductController extends BaseApiController
{
    use AuthorizesRequests;

    protected ExhibitionSpaceProductService $service;

    public function __construct(ExhibitionSpaceProductService $service)
    {
        $this->service = $service;
    }

    /**
     * Admin API: Lấy danh sách sản phẩm trưng bày theo filter, phân trang, sort theo yêu cầu.
     */
    public function index(FilterExhibitionSpaceProductRequest $request): JsonResponse
    {
        $this->authorize('viewAny', ExhibitionSpaceProduct::class);

        $filters = $request->only([
            'status',
            'contract_id',
            'product_id',
            'enterprise_id',
            'keyword',
            'sort_by',
            'sort_order'
        ]);

        $perPage = $request->input('per_page', 15);
        $results = $this->service->getAll($filters, $perPage);

        return response()->json([
            'data' => AdminExhibitionSpaceProductResource::collection($results),
            'meta' => [
                'current_page' => $results->currentPage(),
                'last_page' => $results->lastPage(),
                'per_page' => $results->perPage(),
                'total' => $results->total(),
            ]
        ]);
    }

    /**
     * Doanh nghiệp: Gửi yêu cầu thêm sản phẩm vào không gian trưng bày.
     */
    public function store(StoreExhibitionSpaceProductRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $data = $request->validated();
            // Kiểm tra quyền theo hợp đồng
            $contract = RentalContract::findOrFail($data['rental_contract_id']);
            $this->authorize('create', [ExhibitionSpaceProduct::class, $contract]);

            $product = $this->service->create($data);

            return response()->json([
                'message' => 'Sản phẩm đã được gửi yêu cầu trưng bày.',
                'data' => new ExhibitionSpaceProductResource($product)
            ], 201);
        });
    }

    /**
     * Doanh nghiệp: Lấy danh sách sản phẩm gắn theo hợp đồng cụ thể.
     */
    public function getByContract(RentalContract $contract): JsonResponse
    {
        return $this->safe(function () use ($contract) {
            $this->authorize('viewAnyByContract', [ExhibitionSpaceProduct::class, $contract]);
            $products = $this->service->getByContract($contract);

            return response()->json([
                'data' => ExhibitionSpaceProductResource::collection($products),
            ]);
        });
    }

    /**
     * Doanh nghiệp: Cập nhật thông tin sản phẩm gửi yêu cầu trưng bày.
     */
    public function update(UpdateExhibitionSpaceProductRequest $request, ExhibitionSpaceProduct $exhibitionSpaceProduct): JsonResponse
    {
        return $this->safe(function () use ($request, $exhibitionSpaceProduct) {
            $this->authorize('update', $exhibitionSpaceProduct);
            $data = $request->validated();

            $product = $this->service->update($exhibitionSpaceProduct, $data);

            return response()->json([
                'message' => 'Thông tin sản phẩm đã được cập nhật.',
                'data' => new ExhibitionSpaceProductResource($product)
            ]);
        });
    }

    /**
     * Doanh nghiệp: Xoá sản phẩm yêu cầu trưng bày (chỉ khi trạng thái là PENDING hoặc REJECTED).
     */
    public function destroy(ExhibitionSpaceProduct $exhibitionSpaceProduct): JsonResponse
    {
        return $this->safe(function () use ($exhibitionSpaceProduct) {
            $this->authorize('delete', $exhibitionSpaceProduct);
            $this->service->delete($exhibitionSpaceProduct);

            return response()->json([
                'message' => 'Sản phẩm đã được xoá khỏi không gian trưng bày.'
            ]);
        });
    }

    /**
     * Admin: Duyệt hoặc từ chối sản phẩm trưng bày.
     */
    public function approve(
        ApproveExhibitionSpaceProductRequest $request,
        ExhibitionSpaceProduct $exhibitionSpaceProduct
    ): JsonResponse {
        return $this->safe(function () use ($request, $exhibitionSpaceProduct) {
            $this->authorize('approve', $exhibitionSpaceProduct);
            $exhibitionSpaceProduct = $this->service->approve(
                $exhibitionSpaceProduct,
                $request->validated('status'),
                $request->validated('note')
            );

            return response()->json([
                'message' => 'Sản phẩm đã được xét duyệt.',
                'data' => new ExhibitionSpaceProductResource($exhibitionSpaceProduct),
            ]);
        });
    }

    /**
     * Doanh nghiệp: Xem danh sách sản phẩm của mình đã gửi yêu cầu trưng bày.
     */
    public function indexMine(): JsonResponse
    {
        return $this->safe(function () {
            $products = $this->service->getMyProducts();

            return response()->json([
                'data' => ExhibitionSpaceProductResource::collection($products)
            ]);
        });
    }
}