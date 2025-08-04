<?php

namespace App\Repositories;

use App\Enums\ProductStatus;
use App\Models\RentalContract;

use Illuminate\Support\Collection;
use App\Enums\ExhibitionProductStatus;
use App\Models\ExhibitionSpaceProduct;
use App\Interfaces\ExhibitionSpaceProductInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ExhibitionSpaceProductRepository implements ExhibitionSpaceProductInterface
{

    public function getMyProducts(int $enterpriseId): LengthAwarePaginator
    {
        $query = ExhibitionSpaceProduct::query()
            ->whereHas(
                'rentalContract',
                fn($q) =>
                $q->where('enterprise_id', $enterpriseId)
            )
            ->with(['product', 'rentalContract.space'])
            ->latest('created_at');

        // ✅ Nếu có truyền ?panorama_id=... thì lọc theo đó
        if (request()->filled('panorama_id')) {
            $query->where('position_metadata->panoramaId', request('panorama_id'));
        }

        return $query->paginate(request('per_page', 12));
    }
    public function getByContract(RentalContract $contract): Collection
    {
        $query = ExhibitionSpaceProduct::query()
            ->where('rental_contract_id', $contract->id)
            ->with([
                'product.images' => fn($q) => $q->where('is_main', true),
                'rentalContract.space',
            ]);

        // 🎯 Lọc theo panorama nếu có
        if (request()->filled('panorama_id')) {
            $query->where('position_metadata->panoramaId', request('panorama_id'));
        }

        // ✅ Lọc theo trạng thái được duyệt (nếu có yêu cầu)
        if (request()->boolean('only_published')) {
            $query
                ->where('status', ExhibitionProductStatus::APPROVED)
                ->whereHas('product', function ($q) {
                    $q->where('status', ProductStatus::PUBLISHED);
                });
        }

        return $query->get();
    }





    public function create(array $data): ExhibitionSpaceProduct
    {
        return ExhibitionSpaceProduct::create($data)->refresh()->load(['product', 'rentalContract']);
    }
    public function update(ExhibitionSpaceProduct $product, array $data): ExhibitionSpaceProduct
    {
        $product->update($data);
        return $product->refresh()->load(['product', 'rentalContract']);
    }
    public function delete(ExhibitionSpaceProduct $product): bool
    {
        return $product->delete();
    }
    public function approve(ExhibitionSpaceProduct $product, ExhibitionProductStatus $status, ?string $note = null): ExhibitionSpaceProduct
    {
        $product->update([
            'status' => $status->value,
            'note' => $note,
        ]);

        return $product->refresh()->load(['product', 'rentalContract']);
    }




}