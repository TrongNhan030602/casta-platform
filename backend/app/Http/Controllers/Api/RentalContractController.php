<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\RentalContract;
use Illuminate\Http\JsonResponse;
use App\Services\RentalContractService;
use App\Http\Controllers\BaseApiController;
use App\Http\Requests\RentalContract\HandleExtendRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\RentalContract\RentalContractResource;
use App\Http\Requests\RentalContract\StoreRentalContractRequest;
use App\Http\Requests\RentalContract\CancelRentalContractRequest;
use App\Http\Requests\RentalContract\RejectRentalContractRequest;
use App\Http\Requests\RentalContract\ApproveRentalContractRequest;
use App\Http\Requests\RentalContract\FilterRentalContractsRequest;
use App\Http\Resources\RentalContract\RentalContractDetailResource;
use App\Http\Requests\RentalContract\StoreOfflineRentalContractRequest;

class RentalContractController extends BaseApiController
{
    use AuthorizesRequests;
    protected RentalContractService $service;

    public function __construct(RentalContractService $service)
    {
        $this->service = $service;
    }

    public function index(FilterRentalContractsRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            // ✅ Tự động expire hợp đồng hết hạn
            $this->service->autoExpireContracts();
            $contracts = $this->service->getRentalContracts($request->validated());

            return response()->json([
                'data' => RentalContractResource::collection($contracts),
                'meta' => $this->meta($contracts),
            ]);
        });
    }
    public function storeOffline(StoreOfflineRentalContractRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('createOffline', RentalContract::class);

            $data = $request->validated();
            $contract = $this->service->createOffline($data);

            return response()->json([
                'message' => 'Hợp đồng thuê không gian đã được tạo thành công.',
                'data' => new RentalContractResource(
                    $contract->refresh()->load(['enterprise', 'space', 'reviewer', 'creator'])
                ),
            ], 201);
        });
    }

    public function show(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $contract = $this->service->findOrFail($id);
            $this->authorize('view', $contract);

            return response()->json([
                'data' => new RentalContractDetailResource($contract),
            ]);
        });
    }

    public function store(StoreRentalContractRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $data = $request->validated();

            $contract = $this->service->create($data);

            return response()->json([
                'message' => 'Yêu cầu thuê không gian đã được gửi.',
                'data' => new RentalContractResource(
                    $contract->refresh()->load(['enterprise', 'space', 'reviewer'])
                ),
            ], 201);
        });
    }



    public function destroy(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $contract = $this->service->findOrFail($id);
            $this->authorize('delete', $contract);

            $this->service->delete($contract);

            return response()->json([
                'message' => 'Hợp đồng đã được xoá thành công.',
            ]);
        });
    }

    public function approve(ApproveRentalContractRequest $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $contract = $this->service->findOrFail($id);
            $this->authorize('approve', $contract);

            $approved = $this->service->approve($contract, auth()->id());

            return response()->json([
                'message' => 'Duyệt hợp đồng thành công.',
                'data' => new RentalContractResource($approved),
            ]);
        });
    }
    public function handleExtend(int $id, HandleExtendRequest $request): JsonResponse
    {
        return $this->safe(function () use ($id, $request) {
            $contract = $this->service->findOrFail($id);
            $this->authorize('approve', $contract); // Hoặc tạo policy riêng cho "handleExtend"

            $updated = $this->service->handleExtendRequest($contract, $request->validated());

            return response()->json([
                'message' => 'Xử lý gia hạn thành công.',
                'data' => new RentalContractResource($updated),
            ]);
        });
    }

    public function previewExtendCost(int $id, Request $request): JsonResponse
    {
        return $this->safe(function () use ($id, $request) {
            $contract = $this->service->findOrFail($id);
            $this->authorize('approve', $contract);

            $validated = $request->validate([
                'new_end_date' => 'required|date|after:' . $contract->end_date,
            ]);

            $result = $this->service->previewExtensionCost($contract, $validated['new_end_date']);

            return response()->json([
                'message' => 'Xem trước chi phí gia hạn thành công.',
                'data' => $result,
            ]);
        });
    }


    public function cancel(CancelRentalContractRequest $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($id, $request) {
            $contract = $this->service->findOrFail($id);
            $this->authorize('cancel', $contract);

            $cancelled = $this->service->requestCancel(
                $contract,
                $request->validated('cancel_reason')
            );

            return response()->json([
                'message' => 'Yêu cầu hủy đã được ghi nhận.',
                'data' => new RentalContractResource($cancelled),
            ]);
        });
    }

    public function reject(RejectRentalContractRequest $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $contract = $this->service->findOrFail($id);
            $this->authorize('reject', $contract);

            $rejected = $this->service->reject($contract, auth()->id(), $request->reject_reason);

            return response()->json([
                'message' => 'Hợp đồng đã bị từ chối.',
                'data' => new RentalContractResource($rejected),
            ]);
        });
    }

    public function extend(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $user = auth()->user()->loadMissing('enterprise');


            $contract = $this->service->findOrFail($id);
            $this->authorize('extend', $contract);

            $extended = $this->service->requestExtend($contract);

            return response()->json([
                'message' => 'Yêu cầu gia hạn đã được gửi.',
                'data' => new RentalContractResource($extended),
            ]);
        });
    }


    public function listActiveContracts(): JsonResponse
    {
        return $this->safe(function () {
            $this->authorize('viewAny', RentalContract::class);

            $contracts = $this->service->getActiveContracts();

            return response()->json([
                'data' => RentalContractResource::collection($contracts),
                'meta' => [
                    'current_page' => $contracts->currentPage(),
                    'last_page' => $contracts->lastPage(),
                    'per_page' => $contracts->perPage(),
                    'total' => $contracts->total(),
                ]
            ]);
        });
    }

    public function listMyContracts(): JsonResponse
    {
        return $this->safe(function () {
            $this->authorize('viewAny', RentalContract::class);

            $contracts = $this->service->getMyContracts();

            return response()->json([
                'data' => RentalContractResource::collection($contracts),
                'meta' => [
                    'current_page' => $contracts->currentPage(),
                    'last_page' => $contracts->lastPage(),
                    'per_page' => $contracts->perPage(),
                    'total' => $contracts->total(),
                ]
            ]);
        });
    }

}