<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Feedback;
use App\Enums\FeedbackType;
use App\Enums\FeedbackStatus;
use App\Interfaces\FeedbackInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FeedbackService
{
    protected FeedbackInterface $repo;

    public function __construct(FeedbackInterface $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Gửi phản hồi (mặc định user hiện tại)
     */
    public function create(array $data): Feedback
    {
        $feedback = $this->repo->create([
            'user_id' => auth()->id(),
            'type' => $data['type'],
            'target_id' => $data['target_id'],
            'content' => $data['content'],
            'rating' => $data['rating'] ?? null,
            'status' => FeedbackStatus::NEW ,
        ]);

        $this->syncRatingStats($feedback);

        return $feedback;
    }


    /**
     * Lấy phản hồi của chính người dùng
     */
    public function getMine(): LengthAwarePaginator
    {
        return $this->repo->getMine(auth()->id());
    }

    /**
     * Lấy danh sách phản hồi với bộ lọc (cho admin, DN, CVQL)
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->repo->getAll($filters);
    }

    /**
     * Xem chi tiết phản hồi
     */
    public function findById(int $id): ?Feedback
    {
        return $this->repo->findById($id);
    }

    /**
     * Trả lời phản hồi
     */
    public function reply(Feedback $feedback, string $response): Feedback
    {
        $feedback = $this->repo->reply($feedback, $response);

        $this->syncRatingStats($feedback);

        return $feedback;
    }


    /**
     * Xoá phản hồi
     */
    public function delete(Feedback $feedback): bool
    {
        $deleted = $this->repo->delete($feedback);

        if ($deleted) {
            $this->syncRatingStats($feedback);
        }

        return $deleted;
    }


    /**
     * Thống kê phản hồi
     */
    public function statistics(array $filters = []): array
    {
        return $this->repo->statistics($filters);
    }

    public function getByTarget(
        string $type,
        int $targetId,
        array $filters = [],
        int $perPage = 10
    ): LengthAwarePaginator {
        return $this->repo->getByTarget($type, $targetId, $filters, $perPage);
    }

    protected function syncRatingStats(Feedback $feedback): void
    {
        if (
            $feedback->type === FeedbackType::PRODUCT
            && $feedback->status->isReviewedOrResolved()
            && $feedback->target instanceof Product
        ) {
            $feedback->target->updateRatingStats();
        }
    }

}