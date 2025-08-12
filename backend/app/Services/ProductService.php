<?php

namespace App\Services;

use App\Models\Product;
use App\Enums\ProductStatus;
use App\Models\ProductStockLog;
use App\Mail\ProductApprovalMail;
use App\Interfaces\ProductInterface;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Services\ProductStockLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class ProductService
{
    protected ProductInterface $repo;
    protected ProductStockLogService $stockLogService;

    public function __construct(ProductInterface $repo, ProductStockLogService $stockLogService)
    {
        $this->repo = $repo;
        $this->stockLogService = $stockLogService;
    }
    public function publicSearch(array $filters): LengthAwarePaginator
    {
        return $this->repo->publicSearch($filters);
    }
    public function create(array $data): Product
    {
        $user = auth()->user();

        // DN tạo => mặc định là bản nháp
        if ($user->isEnterprise()) {
            unset($data['status']);
            $data['status'] = ProductStatus::DRAFT;
        } else {
            // Fallback an toàn
            $data['status'] = ProductStatus::PENDING;
        }

        $product = $this->repo->store($data);
        $product->load(['images', 'enterprise', 'category']);

        return $product;
    }

    public function submitForApproval(Product $product): Product
    {
        $user = auth()->user();

        if (!$user->isEnterprise() || $product->enterprise_id !== $user->real_enterprise_id) {
            abort(403, 'Bạn không có quyền gửi duyệt sản phẩm này.');
        }

        if ($product->status !== ProductStatus::DRAFT) {
            throw new \DomainException('Chỉ có thể gửi duyệt từ trạng thái bản nháp.');
        }

        $product->update([
            'status' => ProductStatus::PENDING,
        ]);

        return $product;
    }
    public function getCompactByEnterprise(int $enterpriseId)
    {
        return $this->repo->getCompactByEnterprise($enterpriseId);
    }


    public function updateStatus(Product $product, array $data): bool
    {
        $product = $this->repo->updateStatus($product, $data);

        $status = ProductStatus::tryFrom($data['status']);
        if ($product && in_array($status, [ProductStatus::PUBLISHED, ProductStatus::REJECTED])) {
            $email = $product->enterprise?->user?->email;
            if ($email) {
                Mail::to($email)->send(new ProductApprovalMail($product));
            } else {
                Log::warning("⚠️ Không tìm thấy email doanh nghiệp để gửi mail cho sản phẩm ID {$product->id}");
            }

            return true;
        }

        return false;
    }



    public function updateEnterpriseStatus(Product $product, array $data): bool
    {
        $newStatus = ProductStatus::tryFrom($data['status']);
        $currentStatus = $product->status;

        if (!$newStatus) {
            throw new \InvalidArgumentException('Trạng thái gửi lên không hợp lệ.');
        }

        if (!$currentStatus) {
            throw new \UnexpectedValueException("Trạng thái hiện tại không hợp lệ.");
        }

        // Kiểm tra logic chuyển trạng thái thông thường
        if (!$currentStatus->canTransitionTo($newStatus)) {
            throw new \DomainException("Không thể chuyển trạng thái từ '{$currentStatus->value}' sang '{$newStatus->value}'.");
        }

        // Doanh nghiệp KHÔNG được phép tự set REJECTED
        if ($newStatus === ProductStatus::REJECTED) {
            throw new \DomainException("Doanh nghiệp không thể cập nhật sang trạng thái bị từ chối.");
        }

        // Doanh nghiệp chỉ được set PUBLISHED nếu từ DISABLED (bật lại sản phẩm đã duyệt)
        if ($newStatus === ProductStatus::PUBLISHED && $currentStatus !== ProductStatus::DISABLED) {
            throw new \DomainException("Doanh nghiệp chỉ có thể bật lại sản phẩm đã bị ẩn.");
        }

        $result = $product->update([
            'status' => $newStatus->value,
            'reason_rejected' => null,
            'approved_by' => null,
            'approved_at' => null,
        ]);

        return $result;
    }



    public function update(Product $product, array $data): Product
    {
        $user = auth()->user();

        // Nếu là DN sửa thì reset về trạng thái chờ duyệt
        if ($user->isEnterprise()) {
            // Chỉ kiểm tra khi trạng thái hiện tại KHÁC pending
            if ($product->status !== ProductStatus::PENDING) {
                if (!$product->status->canTransitionTo(ProductStatus::PENDING)) {
                    throw new \DomainException('Không thể gửi duyệt lại từ trạng thái hiện tại.');
                }

                $data['status'] = ProductStatus::PENDING;
                $data['approved_by'] = null;
                $data['approved_at'] = null;
                $data['reason_rejected'] = null;
            }
        }

        return $this->repo->update($product, $data);
    }


    public function findOrFail(int $id): Product
    {
        return Product::withTrashed()->findOrFail($id); // ✅ tìm cả bản ghi đã xoá mềm
    }


    public function delete(Product $product, bool $force = false): bool
    {
        $user = auth()->user();

        // ✅ Nếu không phải QTHT thì kiểm tra quyền sở hữu
        if ($user->isEnterprise() && $product->enterprise_id !== $user->real_enterprise_id) {
            abort(403, 'Bạn không có quyền xoá sản phẩm này.');
        }

        // ✅ Không cho xoá sản phẩm đã công bố
        if ($product->status === ProductStatus::PUBLISHED) {
            abort(400, 'Không thể xoá sản phẩm đã công bố.');
        }

        if ($force) {
            // 👉 Chỉ tải ảnh và xoá khi xoá vĩnh viễn
            $product->loadMissing('images');

            foreach ($product->images as $image) {
                $filePath = $image->url;

                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }

                $image->delete(); // ❗ xoá vĩnh viễn khỏi DB
            }

            return $product->forceDelete(); // ❗ xoá cứng
        }

        // 👉 Xoá mềm: KHÔNG xoá ảnh
        return $product->delete();
    }


    public function restore(int $id): Product
    {
        $product = $this->repo->findWithTrashed($id);

        // Nếu chưa bị xoá => throw
        if (!$product->trashed()) {
            throw new \DomainException("Sản phẩm chưa bị xoá.");
        }

        $this->repo->restore($product);

        return $product->fresh(); // đảm bảo lấy lại bản mới nhất
    }


    public function adminCreate(array $data): Product
    {
        if (empty($data['enterprise_id'])) {
            throw new \InvalidArgumentException('Thiếu enterprise_id khi tạo sản phẩm bởi QTHT.');
        }

        // Nếu không truyền status từ form, gán mặc định là PENDING
        if (!isset($data['status'])) {
            $data['status'] = ProductStatus::PENDING;
        }

        // Nếu là PUBLISHED thì phải gán approved info
        if ($data['status'] === ProductStatus::PUBLISHED) {
            $data['approved_by'] = auth()->id();
            $data['approved_at'] = now();
        }

        $product = $this->repo->store($data);
        $product->load(['images', 'enterprise', 'category']);

        return $product;
    }


    public function adminUpdate(Product $product, array $data): Product
    {
        return $this->repo->update($product, $data);
    }


    /**
     * Tạo log và tăng/giảm tồn kho tương ứng
     */
    public function adjustStock(Product $product, array $data): ProductStockLog
    {
        return $this->stockLogService->createForProduct($product, $data);
    }

    /**
     * Lấy danh sách log tồn kho của 1 sản phẩm có filter
     */
    public function getStockLogs(Product $product, array $filters = [], int $perPage = 15)
    {
        return $this->stockLogService->getByProduct($product, $filters, $perPage);
    }


    public function increaseViews(Product $product): void
    {
        $product->increaseViews();
    }



}