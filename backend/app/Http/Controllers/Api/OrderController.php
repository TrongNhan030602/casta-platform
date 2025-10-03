<?php
namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\BaseApiController;
use App\Http\Resources\Order\OrderResource;
use App\Http\Requests\Order\ListOrdersRequest;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\CreateTransactionRequest;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class OrderController extends BaseApiController
{
    use AuthorizesRequests;

    protected OrderService $service;

    public function __construct(OrderService $service)
    {
        $this->service = $service;
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $this->authorize('create', Order::class);

        return $this->safe(fn() => response()->json([
            'data' => new OrderResource($this->service->createOrder($request->validated()))
        ], 201));
    }

    public function createTransaction(CreateTransactionRequest $request, int $orderId): JsonResponse
    {
        return $this->safe(function () use ($request, $orderId) {
            $order = $this->service->getOrderById($orderId);
            if (!$order) {
                return $this->notFound('Order not found.');
            }

            $this->authorize('createTransaction', [$order, $request->input('sub_order_id')]);


            $transaction = $this->service->createTransaction(
                $order,
                $request->validated(),
                $request->input('sub_order_id') // optional
            );

            return response()->json([
                'data' => $transaction
            ], 201);
        });
    }

    public function show(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $order = $this->service->getOrderById($id);
            if (!$order)
                return $this->notFound('Order not found.');

            $this->authorize('view', $order);

            return response()->json(['data' => new OrderResource($order)]);
        });
    }

    public function index(ListOrdersRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Order::class);

        return $this->safe(function () use ($request) {
            $orders = $this->service->listOrders($request->validated());

            return response()->json([
                'data' => OrderResource::collection($orders),
                'meta' => $this->meta($orders),
            ]);
        });
    }

    public function updateStatus(UpdateOrderStatusRequest $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $order = $this->service->getOrderById($id);
            if (!$order)
                return $this->notFound('Order not found.');

            $this->authorize('updateStatus', $order);

            $updatedOrder = $this->service->updateOrderStatus(
                $order,
                $request->validated()['status'],
                changedBy: auth()->id()
            );

            return response()->json(['data' => new OrderResource($updatedOrder)]);
        });
    }

    /**
     * Xoá mềm
     */
    public function destroy(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $order = $this->service->getOrderById($id);
            if (!$order)
                return $this->notFound('Order not found.');

            $this->authorize('adminDelete', $order);

            $this->service->softDeleteOrder($order);

            return response()->json(['message' => 'Xóa đơn hàng thành công.']);
        });
    }

    /**
     * Khôi phục
     */
    public function restore(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $order = $this->service->findOrderWithTrashed($id);
            if (!$order)
                return $this->notFound('Order not found.');

            $this->authorize('adminDelete', $order);

            $this->service->restoreOrder($order);

            return response()->json(['message' => 'Khôi phục đơn hàng thành công.']);
        });
    }

    /**
     * Xoá vĩnh viễn
     */
    public function forceDelete(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $order = $this->service->findOrderWithTrashed($id);
            if (!$order)
                return $this->notFound('Order not found.');

            $this->authorize('adminDelete', $order);

            $this->service->forceDeleteOrder($order);

            return response()->json(['message' => 'Xóa vĩnh viễn đơn hàng thành công.']);
        });
    }
}