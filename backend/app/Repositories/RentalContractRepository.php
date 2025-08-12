<?php
namespace App\Repositories;

use Carbon\Carbon;
use App\Models\RentalContract;
use App\Enums\RentalContractStatus;
use Illuminate\Support\Facades\Log;
use App\Interfaces\RentalContractInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RentalContractRepository implements RentalContractInterface
{
    public function findOrFail(int $id): RentalContract
    {
        return RentalContract::with([
            'enterprise.reviewer',
            'space.category',
            'space.media',
            'reviewer',
            'creator'
        ])->findOrFail($id);

    }
    public function createByAdmin(array $data): RentalContract
    {
        return RentalContract::create($data)
            ->refresh()
            ->load(['enterprise', 'space', 'creator', 'reviewer']);
    }

    public function getRentalContracts(array $filters): LengthAwarePaginator
    {
        $query = RentalContract::query()
            ->when(
                $filters['status'] ?? null,
                fn($q, $status) =>
                $q->where('status', $status)
            )
            ->when($filters['keyword'] ?? null, function ($q, $keyword) {
                $q->where(function ($query) use ($keyword) {
                    $query->where('code', 'like', "%$keyword%")
                        ->orWhereHas('enterprise', fn($q) => $q->where('company_name', 'like', "%$keyword%"))
                        ->orWhereHas('space', fn($q) => $q->where('code', 'like', "%$keyword%"));
                });
            })
            ->when(
                $filters['start_date'] ?? null,
                fn($q, $start) =>
                $q->whereDate('start_date', '>=', $start)
            )
            ->when(
                $filters['end_date'] ?? null,
                fn($q, $end) =>
                $q->whereDate('end_date', '<=', $end)
            )
            ->when(isset($filters['has_extend_request']), function ($q) use ($filters) {
                if ($filters['has_extend_request']) {
                    $q->whereNotNull('extend_requested_at');
                } else {
                    $q->whereNull('extend_requested_at');
                }
            });


        // ✅ Sắp xếp theo thời gian gửi yêu cầu
        $sortable = ['id', 'start_date', 'end_date', 'created_at'];

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = strtolower($filters['sort_order'] ?? 'desc');

        if (in_array($sortBy, $sortable) && in_array($sortOrder, ['asc', 'desc'])) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query
            ->with([
                'enterprise:id,company_name,email,phone',
                'space:id,code,name,location',
                'creator',
            ])
            ->paginate($filters['per_page'] ?? 20);
    }


    public function create(array $data): RentalContract
    {
        return RentalContract::create($data)
            ->refresh()
            ->load(['enterprise', 'space', 'reviewer']);
    }

    public function approve(RentalContract $contract, int $reviewerId): RentalContract
    {
        $contract->update([
            'status' => RentalContractStatus::APPROVED,
            'approved_at' => now(),
            'reviewed_by' => $reviewerId,
        ]);

        return $contract->refresh()->load(['space', 'enterprise', 'reviewer']);
    }

    public function reject(RentalContract $contract, int $reviewerId, string $reason): RentalContract
    {
        $contract->update([
            'status' => RentalContractStatus::REJECTED,
            'reviewed_by' => $reviewerId,
            'cancel_reason' => $reason,
        ]);

        return $contract->refresh()->load(['enterprise', 'space', 'reviewer']);
    }

    public function requestCancel(RentalContract $contract, ?string $reason = null): RentalContract
    {
        $contract->update([
            'status' => RentalContractStatus::CANCELLED,
            'cancel_reason' => $reason,
        ]);

        return $contract->refresh()->load(['space', 'enterprise', 'reviewer']);
    }

    public function requestExtend(RentalContract $contract): RentalContract
    {
        $contract->update(['extend_requested_at' => now()]);

        return $contract->refresh()->load(['enterprise', 'space', 'reviewer']);
    }

    public function approveExtension(RentalContract $contract, string $newEndDate, int $reviewerId): RentalContract
    {
        $oldEnd = Carbon::parse($contract->end_date)->startOfDay();
        $newEnd = Carbon::parse($newEndDate)->startOfDay();

        if ($newEnd->lessThanOrEqualTo($oldEnd)) {
            abort(400, 'Ngày kết thúc mới phải sau ngày kết thúc cũ.');
        }

        $addedDays = $oldEnd->diffInDays($newEnd); // không tính ngày oldEnd
        $unitPrice = $contract->unit_price ?? 0;

        if ($unitPrice <= 0) {
            abort(400, 'Hợp đồng chưa có đơn giá.');
        }

        $addedCost = $unitPrice * $addedDays;

        $contract->update([
            'end_date' => $newEnd->toDateString(),
            'extend_requested_at' => null,
            'reviewed_by' => $reviewerId,
            'cancel_reason' => null,
            'additional_cost' => ($contract->additional_cost ?? 0) + $addedCost,
            'total_cost' => $contract->total_cost + $addedCost,
        ]);

        // 📝 Ghi log sau khi cập nhật
        Log::info("Gia hạn hợp đồng {$contract->code}: +{$addedDays} ngày, thêm " . number_format($addedCost) . " VND, bởi reviewer ID: {$reviewerId}");

        return $contract->refresh()->load(['enterprise', 'space', 'reviewer']);
    }



    public function rejectExtension(RentalContract $contract, string $reason, int $reviewerId): RentalContract
    {
        $contract->update([
            'extend_requested_at' => null,
            'cancel_reason' => $reason,
            'reviewed_by' => $reviewerId,
        ]);

        return $contract->refresh()->load(['enterprise', 'space', 'reviewer']);
    }

    public function getActiveContracts(): LengthAwarePaginator
    {
        return RentalContract::query()
            ->where('status', RentalContractStatus::APPROVED)
            ->with(['space:id,name,code,zone,location,category_id', 'reviewer:id,name', 'space.category'])

            ->orderByDesc('approved_at')
            ->paginate(15);
    }
    public function getMyContracts(int $enterpriseId): LengthAwarePaginator
    {
        return RentalContract::query()
            ->where('enterprise_id', $enterpriseId)
            ->with(['space:id,name,code,zone,location,category_id', 'reviewer:id,name', 'space.category'])
            ->orderByDesc('created_at')
            ->paginate(15);
    }

    public function delete(RentalContract $contract): bool
    {
        return $contract->delete();
    }


}