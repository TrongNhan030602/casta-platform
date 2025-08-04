<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\ExhibitionSpace;
use Illuminate\Http\JsonResponse;
use App\Enums\ExhibitionSpaceStatus;
use App\Services\ExhibitionSpaceService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\ExhibitionSpace\ExhibitionSpaceResource;
use App\Http\Requests\ExhibitionSpace\StoreExhibitionSpaceRequest;
use App\Http\Requests\ExhibitionSpace\FilterExhibitionSpaceRequest;
use App\Http\Requests\ExhibitionSpace\UpdateExhibitionSpaceRequest;
use App\Http\Requests\ExhibitionSpace\UpdateExhibitionSpaceStatusRequest;

use App\Http\Controllers\BaseApiController;

class ExhibitionSpaceController extends BaseApiController
{
    use AuthorizesRequests;

    protected ExhibitionSpaceService $service;

    public function __construct(ExhibitionSpaceService $service)
    {
        $this->service = $service;
    }


    public function index(FilterExhibitionSpaceRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {

            $filters = $request->only([
                'status',
                'keyword',
                'zone',
                'category_id',
                'price_min',
                'price_max',
                'sort_by',
                'sort_order',
            ]);

            $perPage = $request->input('per_page', 15);

            $spaces = $this->service->listSpaces($filters, $perPage);

            return response()->json([
                'data' => ExhibitionSpaceResource::collection($spaces),
                'meta' => $this->meta($spaces),
            ]);
        });
    }
    public function selectable(): JsonResponse
    {
        return $this->safe(function () {
            $spaces = $this->service->getSelectableSpaces();

            return response()->json($spaces);
        });
    }

    public function show(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $space = $this->service->getSpaceWithRelations($id);

            if (!$space) {
                return response()->json(['message' => 'Không tìm thấy không gian'], 404);
            }


            return response()->json([
                'data' => new ExhibitionSpaceResource($space)
            ]);
        });
    }

    public function store(StoreExhibitionSpaceRequest $request): JsonResponse
    {
        $this->authorize('create', ExhibitionSpace::class);

        $data = $request->validated();
        $data['status'] ??= ExhibitionSpaceStatus::AVAILABLE->value; // Mặc định nếu không có

        $space = $this->service->create($data);

        return response()->json([
            'message' => 'Tạo không gian thành công.',
            'data' => new ExhibitionSpaceResource($space)
        ], 201);
    }


    public function update(UpdateExhibitionSpaceRequest $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $space = $this->service->getOrFail($id);
            $this->authorize('update', $space);

            $data = $request->validated();
            $updated = $this->service->update($space, $data);

            return response()->json([
                'message' => 'Cập nhật thành công.',
                'data' => new ExhibitionSpaceResource($updated)
            ]);
        });
    }

    public function updateStatus(UpdateExhibitionSpaceStatusRequest $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $space = $this->service->getOrFail($id);
            $this->authorize('changeStatus', $space);

            $status = ExhibitionSpaceStatus::from($request->validated('status'));
            $updated = $this->service->updateStatus($space, $status);

            return response()->json([
                'message' => 'Cập nhật trạng thái thành công.',
                'data' => new ExhibitionSpaceResource($updated),
            ]);
        });
    }

    public function destroy(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $space = $this->service->getOrFail($id);
            $this->authorize('delete', $space);

            if ($space->approvedContracts()->exists()) {
                return response()->json([
                    'message' => 'Không thể xoá vì không gian đang có doanh nghiệp thuê đang hoạt động.'
                ], 422);
            }


            $success = $this->service->delete($space);

            return response()->json([
                'message' => $success ? 'Đã xóa không gian.' : 'Xóa thất bại.'
            ], $success ? 200 : 500);
        });
    }


    public function listEnterprisesInSpace(int $spaceId): JsonResponse
    {
        return $this->safe(function () use ($spaceId) {
            $this->authorize('viewAny', ExhibitionSpace::class);
            $enterprises = $this->service->getEnterprisesUsingSpace($spaceId);

            return response()->json(['data' => $enterprises]);
        });
    }

}