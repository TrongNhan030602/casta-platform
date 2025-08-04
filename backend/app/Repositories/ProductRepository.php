<?php

namespace App\Repositories;

use App\Models\Product;
use App\Enums\ProductStatus;
use App\Interfaces\ProductInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository implements ProductInterface
{
    public function store(array $data): Product
    {
        return Product::create($data);
    }
    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        return $product;
    }



    public function delete(Product $product): bool
    {
        return $product->delete();
    }
    public function getCompactByEnterprise(int $enterpriseId)
    {
        return Product::query()
            ->select(['id', 'name']) // ⚠️ chọn trường cần thiết
            ->where('enterprise_id', $enterpriseId)
            ->orderByDesc('created_at')
            ->get();
    }

    public function updateStatus(Product $product, array $data): Product
    {
        $newStatus = ProductStatus::tryFrom($data['status']);
        $currentStatus = $product->status;
        $user = auth()->user();

        if (!$newStatus) {
            throw new \InvalidArgumentException('Trạng thái gửi lên không hợp lệ.');
        }

        if (!$currentStatus->canTransitionTo($newStatus)) {
            throw new \DomainException("Không thể chuyển trạng thái từ '{$currentStatus->value}' sang '{$newStatus->value}'.");
        }

        if (in_array($newStatus, [ProductStatus::PUBLISHED, ProductStatus::REJECTED])) {
            if (!$user || !$user->isSystemUser()) {
                throw new \DomainException("Chỉ quản trị viên mới được duyệt hoặc từ chối sản phẩm.");
            }
        }

        $updated = $product->update([
            'status' => $newStatus,
            'reason_rejected' => $newStatus === ProductStatus::REJECTED ? $data['reason_rejected'] ?? null : null,
            'approved_by' => in_array($newStatus, [ProductStatus::PUBLISHED, ProductStatus::REJECTED]) ? $user->id : null,
            'approved_at' => in_array($newStatus, [ProductStatus::PUBLISHED, ProductStatus::REJECTED]) ? now() : null,
        ]);

        return $updated ? $product->fresh(['enterprise.user']) : null;
    }



    public function restore(Product $product): bool
    {
        return $product->restore();
    }

    public function findWithTrashed(int $id): Product
    {
        return Product::withTrashed()->findOrFail($id);
    }

    public function publicSearch(array $filters): LengthAwarePaginator
    {
        $query = Product::query()
            ->with(['category:id,name', 'enterprise:id,company_name', 'images']);

        // 🔥 Lọc theo xoá mềm (nếu có yêu cầu)
        if (!empty($filters['deleted'])) {
            if ($filters['deleted'] === 'only') {
                $query->onlyTrashed();
            } elseif ($filters['deleted'] === 'all') {
                $query->withTrashed();
            } else {
                $query->withoutTrashed(); // mặc định nếu truyền giá trị không hợp lệ
            }
        } else {
            $query->withoutTrashed(); // mặc định KHÔNG lấy sản phẩm đã xoá
        }

        // ⚙️ Phân loại người dùng
        $user = auth()->user();

        // 👉 Nếu là khách (guest)
        if (auth()->guest()) {
            $query->where('status', ProductStatus::PUBLISHED);
        }

        // 👉 Nếu là QTHT (Admin hoặc CVCC)
        elseif ($user->isSystemUser()) {
            // ✅ Cho phép lọc theo status
            if (!empty($filters['status']) && in_array($filters['status'], ProductStatus::values())) {
                $query->where('status', $filters['status']);
            }

            // ✅ Cho phép lọc theo enterprise_id
            if (!empty($filters['enterprise_id'])) {
                $query->where('enterprise_id', $filters['enterprise_id']);
            }
        }

        // 👉 Nếu là Doanh nghiệp
        elseif ($user->isEnterprise()) {
            // Mặc định chỉ cho thấy sản phẩm của chính họ
            $query->where('enterprise_id', $user->real_enterprise_id);

            // Nếu có truyền status hợp lệ, thì lọc theo
            if (!empty($filters['status']) && in_array($filters['status'], ProductStatus::values())) {
                $query->where('status', $filters['status']);
            }
        }

        // 🔍 Từ khoá tìm kiếm
        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        // 📁 Danh mục
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // 🏢 Tên doanh nghiệp (chỉ áp dụng với QTHT hoặc guest)
        if (!empty($filters['enterprise_name']) && (!$user || $user->isSystemUser())) {
            $query->whereHas('enterprise', function ($q) use ($filters) {
                $q->where('company_name', 'like', '%' . $filters['enterprise_name'] . '%');
            });
        }

        // 💰 Khoảng giá
        if (!empty($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }
        if (!empty($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        // 📊 Sắp xếp
        $sortable = ['name', 'price', 'created_at'];
        $sortBy = in_array($filters['sort_by'] ?? '', $sortable) ? $filters['sort_by'] : 'created_at';
        $sortOrder = in_array(strtolower($filters['sort_order'] ?? ''), ['asc', 'desc']) ? $filters['sort_order'] : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // 📄 Phân trang
        $perPage = $filters['per_page'] ?? 12;

        return $query->paginate($perPage);
    }




}