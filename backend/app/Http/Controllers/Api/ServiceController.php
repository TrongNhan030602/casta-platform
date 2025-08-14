<?php
namespace App\Http\Controllers\Api;

use App\Models\Service;
use Illuminate\Http\Request;
use App\Services\ServiceService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Service\ServiceIndexRequest;
use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Http\Resources\Service\ServiceResource;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ServiceController extends BaseApiController
{
    use AuthorizesRequests, ValidatesRequests;

    protected ServiceService $service;

    public function __construct(ServiceService $service)
    {
        $this->service = $service;
    }

    public function index(ServiceIndexRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('viewAny', Service::class);

            $filters = $request->validated();
            $services = $this->service->publicSearch($filters);

            return response()->json([
                'data' => ServiceResource::collection($services->items()),
                'meta' => $this->meta($services),
            ]);
        });
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('create', Service::class);
            $service = $this->service->create($request->validated());

            return response()->json([
                'message' => 'Dịch vụ đã được tạo thành công.',
                'data' => new ServiceResource($service),
            ], 201);
        });
    }

    public function show(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $service = $this->service->find($id);
            $this->authorize('view', $service);

            return response()->json([
                'data' => new ServiceResource($service),
            ]);
        });
    }

    public function update(UpdateServiceRequest $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $service = $this->service->find($id);
            $this->authorize('update', $service);

            $updated = $this->service->update($id, $request->validated());

            return response()->json([
                'message' => 'Cập nhật dịch vụ thành công.',
                'data' => new ServiceResource($updated),
            ]);
        });
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $service = $this->service->find($id);
            $this->authorize('delete', $service);

            $this->service->delete($id);

            return response()->json(['message' => 'Xóa dịch vụ thành công.']);
        });
    }

    public function restore(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $service = $this->service->find($id);
            $this->authorize('restore', $service);

            $this->service->restore($id);

            return response()->json(['message' => 'Dịch vụ đã được khôi phục.']);
        });
    }

    public function forceDelete(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $service = $this->service->find($id);
            $this->authorize('forceDelete', $service);

            $this->service->forceDelete($id);

            return response()->json(['message' => 'Dịch vụ đã bị xóa vĩnh viễn.']);
        });
    }
}