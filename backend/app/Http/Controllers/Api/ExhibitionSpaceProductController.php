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
use App\Http\Requests\ExhibitionSpaceProduct\UpdateExhibitionSpaceProductRequest;
use App\Http\Requests\ExhibitionSpaceProduct\ApproveExhibitionSpaceProductRequest;

class ExhibitionSpaceProductController extends BaseApiController
{
    use AuthorizesRequests;

    protected ExhibitionSpaceProductService $service;

    public function __construct(ExhibitionSpaceProductService $service)
    {
        $this->service = $service;
    }

    public function store(StoreExhibitionSpaceProductRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $data = $request->validated();

            $contract = RentalContract::findOrFail($data['rental_contract_id']);
            $this->authorize('create', [ExhibitionSpaceProduct::class, $contract]);

            $product = $this->service->create($data);

            return response()->json([
                'message' => 'Sản phẩm đã được gửi yêu cầu trưng bày.',
                'data' => new ExhibitionSpaceProductResource($product)
            ], 201);
        });
    }

    public function getByContract(RentalContract $contract): JsonResponse
    {
        return $this->safe(function () use ($contract) {
            $this->authorize('viewAny', [ExhibitionSpaceProduct::class, $contract]);

            $products = $this->service->getByContract($contract);

            return response()->json([
                'data' => ExhibitionSpaceProductResource::collection($products),
            ]);
        });
    }

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


}