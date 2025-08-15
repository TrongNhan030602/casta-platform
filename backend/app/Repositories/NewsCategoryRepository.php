<?php

namespace App\Repositories;

use App\Models\NewsCategory;
use App\Enums\NewsCategoryStatus;
use App\Interfaces\NewsCategoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class NewsCategoryRepository implements NewsCategoryInterface
{

    public function getTree()
    {
        return NewsCategory::with([
            'children' => function ($q) {
                $q->with('children'); // cấp 2
            }
        ])->whereNull('parent_id')->get();
    }

    public function publicSearch(array $filters): LengthAwarePaginator
    {
        $query = NewsCategory::query();

        // -------------------------
        // Lọc soft delete
        // -------------------------
        if (!empty($filters['deleted'])) {
            if ($filters['deleted'] === 'only') {
                $query->onlyTrashed();
            } elseif ($filters['deleted'] === 'all') {
                $query->withTrashed();
            } else {
                $query->withoutTrashed();
            }
        } else {
            $query->withoutTrashed();
        }

        // -------------------------
        // Lọc trạng thái
        // -------------------------
        if (!empty($filters['status']) && in_array($filters['status'], NewsCategoryStatus::values())) {
            $query->where('status', $filters['status']);
        }

        // -------------------------
        // Lọc danh mục cha
        // -------------------------
        if (isset($filters['parent_id'])) {
            if ((int) $filters['parent_id'] === 0) {
                $query->whereNull('parent_id');
            } elseif (!empty($filters['parent_id'])) {
                $query->where('parent_id', $filters['parent_id']);
            }
        }

        // -------------------------
        // Tìm kiếm theo keyword >= 3 ký tự (chỉ khi nhập)
        // -------------------------
        if (!empty($filters['keyword']) && mb_strlen(trim($filters['keyword'])) >= 3) {
            $keyword = trim($filters['keyword']);
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                    ->orWhere('slug', 'like', "%{$keyword}%");
            });
        }
        // Nếu keyword < 3 ký tự hoặc rỗng, không áp dụng filter → hiển thị tất cả

        // -------------------------
        // Sắp xếp và phân trang
        // -------------------------
        $validSortColumns = ['id', 'name', 'order', 'created_at'];
        $sortBy = in_array($filters['sort_by'] ?? '', $validSortColumns) ? $filters['sort_by'] : 'order';
        $sortOrder = in_array(strtolower($filters['sort_order'] ?? ''), ['asc', 'desc']) ? $filters['sort_order'] : 'asc';
        $perPage = $filters['per_page'] ?? 15;

        $query->orderBy($sortBy, $sortOrder);

        return $query->with(['createdBy', 'updatedBy'])->paginate($perPage);
    }



    public function store(array $data): NewsCategory
    {
        return NewsCategory::create($data);
    }

    public function update(int $id, array $data): NewsCategory
    {
        $category = NewsCategory::findOrFail($id);

        DB::transaction(function () use ($category, $data) {
            $category->update($data);
        });

        return $category->fresh(['parent', 'image', 'createdBy', 'updatedBy']);
    }

    /**
     * Soft delete (mặc định: từ chối nếu còn children chưa xóa).
     * @param int $id
     * @param bool $cascade nếu true sẽ soft-delete đệ quy toàn bộ cây con
     * @return bool
     */
    public function delete(int $id, bool $cascade = false): bool
    {
        $category = NewsCategory::findOrFail($id);

        return DB::transaction(function () use ($category, $cascade) {
            // Tính số children chưa bị xóa
            $activeChildrenCount = $category->children()->whereNull('deleted_at')->count();

            if ($activeChildrenCount > 0 && !$cascade) {
                throw new RuntimeException("Không thể xóa: tồn tại {$activeChildrenCount} danh mục con chưa xóa. Xóa/dời các danh mục con trước hoặc gọi với cascade=true.");
            }

            if ($cascade) {
                $this->softDeleteRecursive($category);
                return true;
            }

            return $category->delete();
        });
    }

    /**
     * Soft-delete đệ quy (children -> ... -> self)
     */
    protected function softDeleteRecursive(NewsCategory $category): void
    {
        foreach ($category->children()->get() as $child) {
            $this->softDeleteRecursive($child);
        }

        if (!$category->trashed()) {
            $category->delete();
        }
    }

    public function find(int $id): NewsCategory
    {
        return NewsCategory::withTrashed()
            ->with([
                'parent',
                'image',
                'createdBy',
                'updatedBy'
            ])
            ->findOrFail($id);
    }

    /**
     * Restore (mặc định: nếu parent trashed sẽ restore parent đệ quy trước)
     * @param int $id
     * @param bool $restoreParent
     * @return bool
     */
    public function restore(int $id, bool $restoreParent = true): bool
    {
        $category = NewsCategory::withTrashed()->findOrFail($id);

        return DB::transaction(function () use ($category, $restoreParent) {
            if ($restoreParent && $category->parent_id) {
                $parent = NewsCategory::withTrashed()->find($category->parent_id);
                if ($parent && $parent->trashed()) {
                    $this->restoreParentRecursive($parent);
                }
            }

            if ($category->trashed()) {
                $category->restore();
            }

            return true;
        });
    }

    protected function restoreParentRecursive(NewsCategory $parent): void
    {
        if ($parent->parent_id) {
            $gp = NewsCategory::withTrashed()->find($parent->parent_id);
            if ($gp && $gp->trashed()) {
                $this->restoreParentRecursive($gp);
            }
        }

        if ($parent->trashed()) {
            $parent->restore();
        }
    }

    /**
     * Force delete (mặc định: từ chối nếu còn children; có thể bật cascade)
     * @param int $id
     * @param bool $cascade
     * @return bool
     */
    public function forceDelete(int $id, bool $cascade = false): bool
    {
        $category = NewsCategory::withTrashed()->findOrFail($id);

        return DB::transaction(function () use ($category, $cascade) {
            $children = $category->children()->withTrashed()->get();

            if ($children->isNotEmpty() && !$cascade) {
                throw new RuntimeException('Không thể xóa vĩnh viễn: tồn tại danh mục con. Xóa/force-delete các danh mục con trước hoặc gọi forceDelete với cascade=true.');
            }

            if ($cascade) {
                $this->forceDeleteRecursive($category);
                return true;
            }

            return (bool) $category->forceDelete();
        });
    }

    protected function forceDeleteRecursive(NewsCategory $category): void
    {
        foreach ($category->children()->withTrashed()->get() as $child) {
            $this->forceDeleteRecursive($child);
        }

        if ($category->trashed()) {
            $category->forceDelete();
        } else {
            // nếu chưa trashed, force delete trực tiếp
            $category->forceDelete();
        }
    }


}