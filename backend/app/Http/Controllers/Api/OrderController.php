<?php
namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Enums\OrderStatus;
use Illuminate\Http\Request;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\BaseApiController;
use App\Http\Resources\Order\OrderResource;
use App\Http\Requests\Order\StoreOrderRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class OrderController extends BaseApiController
{
    use AuthorizesRequests;

    protected OrderService $service;

    public function __construct(OrderService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('viewAny', Order::class);
            $orders = $this->service->search($request->all());

            return response()->json([
                'data' => OrderResource::collection($orders->items()),
                'meta' => $this->meta($orders),
            ]);
        });
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('create', Order::class);
            $order = $this->service->create($request->validated());

            return response()->json([
                'message' => 'Đơn hàng đã được tạo thành công.',
                'data' => new OrderResource($order),
            ], 201);
        });
    }

    public function show(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $order = $this->service->find($id);
            $this->authorize('view', $order);

            return response()->json([
                'data' => new OrderResource($order),
            ]);
        });
    }


    public function updateStatus(Request $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $order = $this->service->find($id);
            $this->authorize('updateStatus', $order);

            $validated = $request->validate([
                'status' => ['required', 'string', 'in:' . implode(',', OrderStatus::values())],
                'note' => ['nullable', 'string', 'max:1000'],
            ]);

            // ✅ ép sang enum
            $status = OrderStatus::from($validated['status']);

            $order = $this->service->updateStatus($order, $status, $validated['note'] ?? null);

            return response()->json([
                'message' => 'Trạng thái đơn hàng đã được cập nhật.',
                'data' => new OrderResource($order),
            ]);
        });
    }


}