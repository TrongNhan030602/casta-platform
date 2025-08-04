<?php
namespace App\Services;

use App\Models\Enterprise;
use App\Interfaces\EnterpriseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EnterpriseService
{
    protected EnterpriseRepositoryInterface $enterpriseRepo;

    public function __construct(EnterpriseRepositoryInterface $enterpriseRepo)
    {
        $this->enterpriseRepo = $enterpriseRepo;
    }

    public function getEnterprises(array $filters): LengthAwarePaginator
    {
        return $this->enterpriseRepo->getAll($filters);
    }
    public function getSimpleList(?string $keyword = null, int $limit = 100)
    {
        return $this->enterpriseRepo->getSimpleList($keyword, $limit);
    }

    public function getEnterpriseById(int $id): ?Enterprise
    {
        return $this->enterpriseRepo->findById($id);
    }

    public function createEnterprise(array $data): Enterprise
    {
        return $this->enterpriseRepo->create($data);
    }

    public function updateEnterprise(Enterprise $enterprise, array $data): bool
    {
        return $this->enterpriseRepo->update($enterprise, $data);
    }


    public function approveEnterprise(Enterprise $enterprise, int $reviewedBy): bool
    {
        return $this->enterpriseRepo->approve($enterprise, $reviewedBy);
    }

    public function rejectEnterprise(Enterprise $enterprise, int $reviewedBy): bool
    {
        return $this->enterpriseRepo->reject($enterprise, $reviewedBy);
    }

    public function suspendEnterprise(Enterprise $enterprise): bool
    {
        return $this->enterpriseRepo->suspend($enterprise);
    }
    public function resumeEnterprise(Enterprise $enterprise): bool
    {
        return $this->enterpriseRepo->resume($enterprise);
    }


}