<?php

namespace App\Repositories;

use App\Models\Feedback;
use App\Enums\FeedbackType;
use App\Enums\FeedbackStatus;
use App\Interfaces\FeedbackInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FeedbackRepository implements FeedbackInterface
{
    public function create(array $data): Feedback
    {
        return Feedback::create($data)->refresh()->load('user');
    }

    public function getMine(int $userId): LengthAwarePaginator
    {
        return Feedback::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->with(['user'])
            ->paginate(10);
    }

    public function getAll(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? $perPage;

        $allowedSorts = ['id', 'rating', 'created_at', 'updated_at'];
        $allowedOrders = ['asc', 'desc'];

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = strtolower($filters['sort_order'] ?? 'desc');

        $query = Feedback::query()
            ->with(['user'])
            ->when($filters['type'] ?? null, fn($q, $type) => $q->where('type', $type))
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            ->when($filters['target_id'] ?? null, fn($q, $targetId) => $q->where('target_id', $targetId))
            ->when($filters['user_id'] ?? null, fn($q, $userId) => $q->where('user_id', $userId))
            ->when($filters['keyword'] ?? null, function ($q, $kw) {
                $kw = addcslashes($kw, '%_');
                $q->where(function ($query) use ($kw) {
                    $query->where('content', 'like', "%$kw%")
                        ->orWhereHas('user', fn($q) => $q->where('name', 'like', "%$kw%"));
                });
            });


        // ✅ Sắp xếp có kiểm tra hợp lệ
        if (in_array($sortBy, $allowedSorts) && in_array($sortOrder, $allowedOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderByDesc('created_at');
        }

        return $query->paginate($perPage);
    }

    public function getByTarget(
        string $type,
        int $targetId,
        array $filters = [],
        int $perPage = 10
    ): LengthAwarePaginator {
        $allowedSorts = ['id', 'rating', 'created_at', 'updated_at'];
        $allowedOrders = ['asc', 'desc'];

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = strtolower($filters['sort_order'] ?? 'desc');

        $query = Feedback::query()
            ->where('type', $type)
            ->where('target_id', $targetId)
            ->with('user')
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            ->when($filters['user_id'] ?? null, fn($q, $userId) => $q->where('user_id', $userId))
            ->when($filters['keyword'] ?? null, function ($q, $kw) {
                $kw = addcslashes($kw, '%_');
                $q->where(function ($query) use ($kw) {
                    $query->where('content', 'like', "%$kw%")
                        ->orWhereHas('user', fn($q) => $q->where('name', 'like', "%$kw%"));
                });
            });

        if (in_array($sortBy, $allowedSorts) && in_array($sortOrder, $allowedOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderByDesc('created_at');
        }

        return $query->paginate($filters['per_page'] ?? $perPage);
    }




    public function findById(int $id): ?Feedback
    {
        $feedback = Feedback::with('user')->find($id);

        if (!$feedback)
            return null;

        // Không cần setRelation vì target là accessor
        return $feedback;
    }




    public function reply(Feedback $feedback, string $response): Feedback
    {
        $feedback->update([
            'response' => $response,
            'status' => FeedbackStatus::RESOLVED,
        ]);

        return $feedback->refresh();
    }

    public function delete(Feedback $feedback): bool
    {
        return $feedback->delete();
    }

    public function statistics(array $filters = []): array
    {
        $query = Feedback::query();

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['target_id'])) {
            $query->where('target_id', $filters['target_id']);
        }

        $total = (clone $query)->count();
        $averageRating = (clone $query)->avg('rating');

        return [
            'total' => $total,
            'average_rating' => round((float) $averageRating, 2),
        ];
    }
}