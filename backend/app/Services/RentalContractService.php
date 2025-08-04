<?php
namespace App\Services;

use Carbon\Carbon;
use App\Enums\UserRole;
use App\Models\RentalContract;
use App\Models\ExhibitionSpace;
use App\Enums\RentalContractStatus;
use Illuminate\Support\Facades\Mail;
use App\Mail\RentalContractApprovedMail;
use App\Interfaces\RentalContractInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RentalContractService
{
    protected RentalContractInterface $repo;

    public function __construct(RentalContractInterface $repo)
    {
        $this->repo = $repo;
    }

    public function getRentalContracts(array $filters): LengthAwarePaginator
    {
        return $this->repo->getRentalContracts($filters);
    }
    public function findOrFail(int $id): RentalContract
    {
        return $this->repo->findOrFail($id);
    }
    public function create(array $data): RentalContract
    {
        $user = auth()->user();

        if (!$user) {
            abort(401, 'Bạn cần đăng nhập để thực hiện thao tác này.');
        }

        if (!UserRole::requiresEnterpriseProfile($user->role) || !$user->real_enterprise_id) {
            abort(403, 'Chỉ doanh nghiệp mới được phép tạo hợp đồng thuê.');
        }

        $data['enterprise_id'] = $user->real_enterprise_id;

        // Không cho gửi lại yêu cầu nếu đang chờ duyệt
        $exists = RentalContract::where('enterprise_id', $data['enterprise_id'])
            ->where('exhibition_space_id', $data['exhibition_space_id'])
            ->where('status', RentalContractStatus::PENDING)
            ->exists();

        if ($exists) {
            abort(400, 'Bạn đã gửi yêu cầu thuê không gian này và đang chờ duyệt.');
        }

        // Tính giá thuê và số ngày
        $space = ExhibitionSpace::findOrFail($data['exhibition_space_id']);
        $unitPrice = $space->price; // Giá thuê mỗi ngày

        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);

        // Kiểm tra logic ngày
        if ($endDate->lt($startDate)) {
            abort(422, 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.');
        }

        $days = $startDate->diffInDays($endDate) + 1; // bao gồm cả ngày kết thúc

        $data['unit_price'] = $unitPrice;
        $data['total_cost'] = $unitPrice * $days;

        return $this->repo->create($data);
    }




    public function delete(RentalContract $contract): bool
    {
        if (
            !in_array($contract->status, [
                RentalContractStatus::PENDING,
                RentalContractStatus::CANCELLED,
                RentalContractStatus::REJECTED,
            ], true)
        ) {
            throw new \Exception('Không thể xoá hợp đồng đã duyệt.');
        }

        return $this->repo->delete($contract);
    }



    public function approve(RentalContract $contract, int $reviewerId): RentalContract
    {
        if ($contract->status !== RentalContractStatus::PENDING) {
            abort(400, 'Chỉ có thể duyệt hợp đồng đang chờ duyệt.');
        }
        $contract->update([
            'status' => RentalContractStatus::APPROVED,
            'approved_at' => now(),
            'reviewed_by' => $reviewerId,
        ]);

        $contract = $contract->refresh()->load([
            'space',
            'enterprise.user',
            'reviewer',
        ]);

        // ✅ Gửi mail cho DN
        if ($contract->enterprise?->user?->email) {
            Mail::to($contract->enterprise->user->email)->send(
                new RentalContractApprovedMail($contract)
            );
        }

        return $contract;
    }
    public function handleExtendRequest(RentalContract $contract, array $data): RentalContract
    {
        if (!$contract->extend_requested_at) {
            abort(400, 'Hợp đồng này không có yêu cầu gia hạn.');
        }

        if ($data['action'] === 'approve') {
            return $this->repo->approveExtension($contract, $data['new_end_date'], auth()->id());
        }

        if ($data['action'] === 'reject') {
            return $this->repo->rejectExtension($contract, $data['reject_reason'], auth()->id());
        }

        abort(400, 'Hành động không hợp lệ.');
    }
    public function previewExtensionCost(RentalContract $contract, string $newEndDate): array
    {
        // Validate trước khi parse
        if (!is_string($newEndDate) || empty($newEndDate)) {
            abort(400, 'Ngày kết thúc mới không hợp lệ.');
        }

        $oldEnd = Carbon::parse($contract->end_date)->startOfDay();
        $newEnd = Carbon::parse($newEndDate)->startOfDay();

        if ($newEnd->lessThanOrEqualTo($oldEnd)) {
            abort(400, 'Ngày kết thúc mới phải sau ngày kết thúc hiện tại.');
        }

        $addedDays = $oldEnd->diffInDays($newEnd); // Không tính ngày kết thúc cũ
        $unitPrice = $contract->unit_price ?? 0;

        if ($unitPrice <= 0) {
            abort(400, 'Hợp đồng chưa có đơn giá.');
        }

        $addedCost = $unitPrice * $addedDays;
        $totalCost = $contract->total_cost + $addedCost;

        return [
            'contract_id' => $contract->id,
            'code' => $contract->code,
            'old_end_date' => $oldEnd->toDateString(),
            'new_end_date' => $newEnd->toDateString(),
            'added_days' => $addedDays,
            'unit_price' => $unitPrice,
            'added_cost' => $addedCost,
            'new_total_cost' => $totalCost,
        ];
    }

    public function requestCancel(RentalContract $contract, ?string $reason = null): RentalContract
    {
        if ($contract->status !== RentalContractStatus::PENDING) {
            abort(400, 'Chỉ có thể hủy hợp đồng đang chờ duyệt.');
        }

        return $this->repo->requestCancel($contract, $reason);
    }

    public function reject(RentalContract $contract, int $reviewerId, string $reason): RentalContract
    {
        if ($contract->status !== RentalContractStatus::PENDING) {
            abort(400, 'Chỉ có thể từ chối hợp đồng đang chờ duyệt.');
        }

        return $this->repo->reject($contract, $reviewerId, $reason);
    }



    public function requestExtend(RentalContract $contract): RentalContract
    {
        if ($contract->extend_requested_at) {
            abort(400, 'Hợp đồng này đã được yêu cầu gia hạn trước đó.');
        }

        $contract->update(['extend_requested_at' => now()]);

        return $contract->refresh()->load(['enterprise', 'space', 'reviewer']);
    }



    public function getActiveContracts(): LengthAwarePaginator
    {
        return $this->repo->getActiveContracts();
    }
    public function getMyContracts(): LengthAwarePaginator
    {
        $enterpriseId = auth()->user()->enterprise->id;
        return $this->repo->getMyContracts($enterpriseId);
    }

    public function autoExpireContracts(): void
    {
        // ✅ Cho phép kết thúc trong ngày, expire từ ngày hôm sau
        $expiredCount = RentalContract::where('status', RentalContractStatus::APPROVED)
            ->whereDate('end_date', '<', now()->toDateString())
            ->update(['status' => RentalContractStatus::EXPIRED]);

        if ($expiredCount > 0) {
            logger()->info("[$expiredCount] hợp đồng thuê đã được tự động cập nhật trạng thái EXPIRED.");
        }
    }


}