<?php
namespace App\Repositories;

use App\Models\Customer;
use App\Interfaces\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerRepository implements CustomerRepositoryInterface
{
    public function getAll(array $filters): LengthAwarePaginator
    {
        $query = Customer::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('phone', 'like', '%' . $search . '%')
                    ->orWhereHas('user', function ($subQ) use ($search) {
                        $subQ->where('name', 'like', '%' . $search . '%')
                            ->orWhere('email', 'like', '%' . $search . '%');
                    });
            });
        }

        return $query->with('user')->paginate($filters['per_page'] ?? 15);
    }


    public function findById(int $id): ?Customer
    {
        return Customer::with('user')->find($id);
    }



    public function update(Customer $customer, array $data): bool
    {
        return $customer->update($data);
    }


}