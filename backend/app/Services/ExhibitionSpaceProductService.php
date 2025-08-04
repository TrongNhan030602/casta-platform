<?php

namespace App\Services;

use App\Models\RentalContract;
use Illuminate\Support\Collection;
use App\Enums\RentalContractStatus;
use App\Enums\ExhibitionProductStatus;
use App\Models\ExhibitionSpaceProduct;
use App\Interfaces\ExhibitionSpaceProductInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ExhibitionSpaceProductService
{
    protected ExhibitionSpaceProductInterface $repo;

    public function __construct(ExhibitionSpaceProductInterface $repo)
    {
        $this->repo = $repo;
    }

    public function getMyProducts(): LengthAwarePaginator
    {
        $user = auth()->user();

        if (!$user || !$user->real_enterprise_id) {
            abort(403, 'Chỉ doanh nghiệp mới xem được sản phẩm của mình.');
        }

        return $this->repo->getMyProducts($user->real_enterprise_id);
    }
    public function getByContract(RentalContract $contract): Collection
    {
        $user = auth()->user();

        if (!$user || !$user->real_enterprise_id || $contract->enterprise_id !== $user->real_enterprise_id) {
            abort(403, 'Không có quyền truy cập hợp đồng này.');
        }

        return $this->repo->getByContract($contract);
    }

    public function create(array $data): ExhibitionSpaceProduct
    {
        $user = auth()->user();

        // Tìm hợp đồng và kiểm tra quyền sở hữu
        $contract = RentalContract::where('id', $data['rental_contract_id'])
            ->where('enterprise_id', $user->real_enterprise_id)
            ->firstOrFail();

        // ⚠️ Check logic nghiệp vụ tại đây
        if ($contract->status !== RentalContractStatus::APPROVED) {
            abort(403, 'Không thể thêm sản phẩm vào hợp đồng chưa được duyệt.');
        }

        $data['status'] = ExhibitionProductStatus::PENDING;

        return $this->repo->create($data);
    }


    public function update(ExhibitionSpaceProduct $product, array $data): ExhibitionSpaceProduct
    {
        $user = auth()->user();

        // Kiểm tra quyền sở hữu
        if ($product->rentalContract->enterprise_id !== $user->real_enterprise_id) {
            abort(403, 'Bạn không có quyền cập nhật sản phẩm này.');
        }

        if (
            !in_array($product->status, [
                ExhibitionProductStatus::PENDING,
                ExhibitionProductStatus::REJECTED,
            ])
        ) {
            abort(400, 'Chỉ được cập nhật sản phẩm khi đang chờ duyệt hoặc đã bị từ chối.');
        }

        // Reset trạng thái về pending nếu trước đó là rejected
        if ($product->status === ExhibitionProductStatus::REJECTED) {
            $data['status'] = ExhibitionProductStatus::PENDING;
        }

        return $this->repo->update($product, $data);
    }

    public function delete(ExhibitionSpaceProduct $product): bool
    {
        $user = auth()->user();

        if ($product->rentalContract->enterprise_id !== $user->real_enterprise_id) {
            abort(403, 'Bạn không có quyền xoá sản phẩm này.');
        }

        if (
            !in_array($product->status, [
                ExhibitionProductStatus::PENDING,
                ExhibitionProductStatus::REJECTED,
            ])
        ) {
            abort(400, 'Chỉ được xoá sản phẩm khi đang chờ duyệt hoặc đã bị từ chối.');
        }

        return $this->repo->delete($product);
    }

    public function approve(ExhibitionSpaceProduct $product, string $status, ?string $note = null): ExhibitionSpaceProduct
    {
        $product->refresh();

        $statusEnumFromDb = $product->status;

        if ($statusEnumFromDb !== ExhibitionProductStatus::PENDING) {
            abort(400, 'Chỉ được xét duyệt sản phẩm khi đang chờ duyệt.');
        }

        $statusEnum = ExhibitionProductStatus::tryFrom($status);
        if (!$statusEnum) {
            abort(400, 'Trạng thái không hợp lệ.');
        }

        if ($statusEnum === ExhibitionProductStatus::REJECTED && !$note) {
            abort(400, 'Vui lòng ghi lý do từ chối.');
        }

        return $this->repo->approve($product, $statusEnum, $note);
    }




}