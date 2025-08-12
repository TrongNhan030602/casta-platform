<?php

namespace App\Repositories;

use App\Enums\ProductStatus;
use App\Models\RentalContract;

use Illuminate\Support\Collection;
use App\Enums\RentalContractStatus;
use App\Enums\ExhibitionProductStatus;
use App\Models\ExhibitionSpaceProduct;
use App\Interfaces\ExhibitionSpaceProductInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ExhibitionSpaceProductRepository implements ExhibitionSpaceProductInterface
{

    public function getAll(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = ExhibitionSpaceProduct::with([
            'product.category',
            'rentalContract.enterprise',
            'rentalContract.space'
        ]);

        $query->when($filters['status'] ?? null, fn($q, $v) => $q->where('status', $v));
        $query->when($filters['contract_id'] ?? null, fn($q, $v) => $q->where('rental_contract_id', $v));
        $query->when($filters['product_id'] ?? null, fn($q, $v) => $q->where('product_id', $v));

        $query->when($filters['enterprise_id'] ?? null, function ($q, $enterpriseId) {
            $q->whereHas('rentalContract.enterprise', function ($subQ) use ($enterpriseId) {
                $subQ->where('id', $enterpriseId);
            });
        });

        $query->when($filters['keyword'] ?? null, function ($q, $kw) {
            $kw = addcslashes($kw, '%_');
            $q->whereHas(
                'product',
                fn($subQ) =>
                $subQ->where('name', 'like', "%$kw%")
            );
        });

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';

        return $query->orderBy($sortBy, $sortOrder)->paginate($perPage);
    }


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
                })
                ->whereHas('rentalContract', function ($q) {
                    $q->where('status', RentalContractStatus::APPROVED)
                        ->whereDate('end_date', '>=', now());
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