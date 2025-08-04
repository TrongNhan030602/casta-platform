<?php

namespace App\Interfaces;

use App\Models\Feedback;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface FeedbackInterface
{
    /**
     * Tạo phản hồi mới
     */
    public function create(array $data): Feedback;

    /**
     * Lấy danh sách phản hồi của user hiện tại
     */
    public function getMine(int $userId): LengthAwarePaginator;

    /**
     * Lấy danh sách phản hồi theo bộ lọc (admin, DN, CVQL)
     */
    public function getAll(array $filters, int $perPage = 15): LengthAwarePaginator;

    /**
     * Lấy chi tiết một phản hồi
     */
    public function findById(int $id): ?Feedback;

    /**
     * Trả lời phản hồi
     */
    public function reply(Feedback $feedback, string $response): Feedback;

    /**
     * Xoá phản hồi
     */
    public function delete(Feedback $feedback): bool;

    /**
     * Thống kê phản hồi (đếm theo loại, rating trung bình)
     */
    public function statistics(array $filters = []): array;

    // Lấy DS phản hồi của 1 đối tượng (vd: không gian, sản phẩm)
    public function getByTarget(
        string $type,
        int $targetId,
        array $filters = [],
        int $perPage = 10
    ): LengthAwarePaginator;

}