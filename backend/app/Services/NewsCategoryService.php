<?php
namespace App\Services;

use App\Interfaces\NewsCategoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\NewsCategory;

class NewsCategoryService
{
    protected NewsCategoryInterface $repo;

    public function __construct(NewsCategoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function publicSearch(array $filters): LengthAwarePaginator
    {
        return $this->repo->publicSearch($filters);
    }

    public function store(array $data): NewsCategory
    {
        $data['created_by'] = auth()->id();
        $data['updated_by'] = auth()->id();

        return $this->repo->store($data);
    }

    public function update(int $id, array $data): NewsCategory
    {
        $data['updated_by'] = auth()->id();

        return $this->repo->update($id, $data);
    }

    /**
     * Soft delete
     * @param int $id
     * @param bool $cascade nếu true -> soft delete đệ quy
     */
    public function delete(int $id, bool $cascade = false): bool
    {
        return $this->repo->delete($id, $cascade);
    }

    /**
     * Tìm (lưu ý repo dùng findOrFail nên trả về NewsCategory)
     */
    public function find(int $id): NewsCategory
    {
        return $this->repo->find($id);
    }

    /**
     * Restore
     * @param int $id
     * @param bool $restoreParent nếu true -> restore parent đệ quy trước khi restore node
     */
    public function restore(int $id, bool $restoreParent = true): bool
    {
        return $this->repo->restore($id, $restoreParent);
    }

    /**
     * Force delete
     * @param int $id
     * @param bool $cascade nếu true -> force-delete đệ quy
     */
    public function forceDelete(int $id, bool $cascade = false): bool
    {
        return $this->repo->forceDelete($id, $cascade);
    }

    public function getTree()
    {
        return $this->repo->getTree();
    }
}