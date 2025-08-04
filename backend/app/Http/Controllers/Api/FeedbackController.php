<?php

namespace App\Http\Controllers\Api;

use App\Models\Feedback;
use App\Services\FeedbackService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\BaseApiController;
use App\Http\Resources\Feedback\FeedbackResource;
use App\Http\Requests\Feedback\ReplyFeedbackRequest;
use App\Http\Requests\Feedback\StoreFeedbackRequest;
use App\Http\Requests\Feedback\FilterFeedbackRequest;
use App\Http\Resources\Feedback\FeedbackDetailResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\Feedback\GetFeedbackByTargetRequest;

class FeedbackController extends BaseApiController
{
    use AuthorizesRequests;

    protected FeedbackService $service;

    public function __construct(FeedbackService $service)
    {
        $this->service = $service;
    }

    public function store(StoreFeedbackRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('create', Feedback::class);
            $feedback = $this->service->create($request->validated());

            return response()->json([
                'message' => 'Phản hồi của bạn đã được gửi.',
                'data' => new FeedbackResource($feedback),
            ], 201);
        });
    }

    public function indexMine(): JsonResponse
    {
        return $this->safe(function () {
            $feedbacks = $this->service->getMine();

            return response()->json([
                'data' => FeedbackResource::collection($feedbacks)->resolve(),
                'meta' => $this->meta($feedbacks),
            ]);
        });
    }

    public function index(FilterFeedbackRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('viewAny', Feedback::class);
            $feedbacks = $this->service->getAll($request->validated());

            return response()->json([
                'data' => FeedbackResource::collection($feedbacks)->resolve(),
                'meta' => $this->meta($feedbacks),
            ]);
        });
    }

    public function show(Feedback $feedback): JsonResponse
    {
        return $this->safe(function () use ($feedback) {
            $this->authorize('view', $feedback);

            return response()->json([
                'data' => new FeedbackDetailResource($feedback),
            ]);
        });
    }

    public function reply(Feedback $feedback, ReplyFeedbackRequest $request): JsonResponse
    {
        return $this->safe(function () use ($feedback, $request) {
            $this->authorize('reply', $feedback);

            $feedback = $this->service->reply($feedback, $request->validated('response'));

            return response()->json([
                'message' => 'Đã phản hồi lại ý kiến.',
                'data' => new FeedbackResource($feedback),
            ]);
        });
    }

    public function destroy(Feedback $feedback): JsonResponse
    {
        return $this->safe(function () use ($feedback) {
            $this->authorize('delete', $feedback);

            $this->service->delete($feedback);

            return response()->json(['message' => 'Đã xoá phản hồi.']);
        });
    }

    public function getByTarget(GetFeedbackByTargetRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $validated = $request->validated();

            $type = $validated['type'];
            $targetId = (int) $validated['target_id'];
            $perPage = (int) ($validated['per_page'] ?? 10);

            $filters = $validated;

            $feedbacks = $this->service->getByTarget($type, $targetId, $filters, $perPage);

            return response()->json([
                'data' => FeedbackResource::collection($feedbacks)->resolve(),
                'meta' => $this->meta($feedbacks),
            ]);
        });
    }


    public function statistics(): JsonResponse
    {
        return $this->safe(function () {
            $filters = request()->only(['type', 'target_id']); // Lọc theo type và target_id nếu có
            $stats = $this->service->statistics($filters);

            return response()->json([
                'data' => $stats,
            ]);
        });
    }

}