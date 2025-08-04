<?php

namespace App\Repositories;

use App\Models\RentalContract;
use App\Models\ExhibitionSpace;
use App\Enums\RentalContractStatus;
use App\Enums\ExhibitionSpaceStatus;
use Illuminate\Database\Eloquent\Builder;
use App\Interfaces\ExhibitionSpaceInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
class ExhibitionSpaceRepository implements ExhibitionSpaceInterface
{
    public function getAll(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';

        return ExhibitionSpace::with('media')
            ->when($filters['status'] ?? null, function (Builder $q, $status) {
                $statusValue = $status instanceof ExhibitionSpaceStatus ? $status->value : $status;
                $q->where('status', $statusValue);
            })
            ->when($filters['keyword'] ?? null, function (Builder $q, $kw) {
                $kw = addcslashes($kw, '%_');
                $q->where(function ($query) use ($kw) {
                    $query->where('name', 'like', "%$kw%")
                        ->orWhere('code', 'like', "%$kw%")
                        ->orWhere('location', 'like', "%$kw%")
                        ->orWhere('zone', 'like', "%$kw%")
                        ->orWhere('description', 'like', "%$kw%");
                });
            }, function (Builder $q) use ($filters) {
                $q->when($filters['zone'] ?? null, fn($q, $zone) => $q->where('zone', $zone))
                    ->when($filters['category_id'] ?? null, fn($q, $catId) => $q->where('category_id', $catId))
                    ->when($filters['price_min'] ?? null, fn($q, $min) => $q->where('price', '>=', $min))
                    ->when($filters['price_max'] ?? null, fn($q, $max) => $q->where('price', '<=', $max));
            })
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage);
    }




    public function findById(int $id): ?ExhibitionSpace
    {
        return ExhibitionSpace::find($id);
    }
    public function findWithRelations(int $id): ?ExhibitionSpace
    {
        return ExhibitionSpace::with([
            'category:id,name',
            'media:id,exhibition_space_id,type,url,caption,order,metadata',
            'rentalContracts.enterprise:id,company_name,email'
        ])->find($id);
    }

    public function getSelectableSpaces(): Collection
    {
        return ExhibitionSpace::select('id', 'code', 'name')
            ->orderBy('name')
            ->get();
    }


    public function create(array $data): ExhibitionSpace
    {
        return ExhibitionSpace::create($data);
    }

    public function update(ExhibitionSpace $space, array $data): ExhibitionSpace
    {

        $space->update($data);


        return ExhibitionSpace::with([
            'category:id,name',
            'media:id,exhibition_space_id,type,url,caption,order,metadata',
            'rentalContracts.enterprise:id,company_name,email'
        ])->findOrFail($space->id);
    }


    public function findOrFail(int $id): ExhibitionSpace
    {
        return ExhibitionSpace::findOrFail($id);
    }


    public function delete(ExhibitionSpace $space): bool
    {
        return $space->delete();
    }

    public function getEnterprisesUsingSpace(int $spaceId): array
    {
        return RentalContract::query()
            ->where('exhibition_space_id', $spaceId)
            ->where('status', RentalContractStatus::APPROVED)
            ->whereDate('end_date', '>=', now())
            ->with(['enterprise:id,company_name,email,phone,tax_code,logo_url,business_field,address,district'])
            ->get()
            ->map(function ($contract) {
                return [
                    'contract_id' => $contract->id,
                    'start_date' => $contract->start_date->toDateString(),
                    'end_date' => $contract->end_date->toDateString(),
                    'total_cost' => $contract->total_cost,
                    'enterprise' => [
                        'id' => $contract->enterprise->id,
                        'company_name' => $contract->enterprise->company_name,
                        'email' => $contract->enterprise->email,
                        'phone' => $contract->enterprise->phone,
                        'tax_code' => $contract->enterprise->tax_code,
                        'business_field' => $contract->enterprise->business_field,
                        'logo_url' => $contract->enterprise->logo_url,
                        'address' => $contract->enterprise->address,
                        'district' => $contract->enterprise->district,
                        'is_current' => now()->between($contract->start_date, $contract->end_date),
                        'is_upcoming' => now()->lt($contract->start_date),
                    ],
                ];
            })
            ->values()
            ->all();
    }


}