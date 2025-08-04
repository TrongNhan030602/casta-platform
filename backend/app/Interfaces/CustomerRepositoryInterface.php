<?php
namespace App\Interfaces;

use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerRepositoryInterface
{
    public function getAll(array $filters): LengthAwarePaginator;

    public function findById(int $id): ?Customer;


    public function update(Customer $customer, array $data): bool;

}