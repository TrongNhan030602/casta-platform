<?php

namespace App\Interfaces;
use App\Models\RentalContract;
use Illuminate\Support\Collection;
use App\Enums\ExhibitionProductStatus;
use App\Models\ExhibitionSpaceProduct;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ExhibitionSpaceProductInterface
{
    public function getAll(array $filters, int $perPage = 15): LengthAwarePaginator;

    public function create(array $data): ExhibitionSpaceProduct;
    public function update(ExhibitionSpaceProduct $product, array $data): ExhibitionSpaceProduct;
    public function delete(ExhibitionSpaceProduct $product): bool;
    public function approve(ExhibitionSpaceProduct $product, ExhibitionProductStatus $status, ?string $note = null): ExhibitionSpaceProduct;

    public function getMyProducts(int $enterpriseId): LengthAwarePaginator;
    public function getByContract(RentalContract $contract): Collection;

}