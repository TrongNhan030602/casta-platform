<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Facades\Storage;
use App\Interfaces\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerService
{
    protected CustomerRepositoryInterface $customerRepo;

    public function __construct(CustomerRepositoryInterface $customerRepo)
    {
        $this->customerRepo = $customerRepo;
    }

    public function getCustomers(array $filters): LengthAwarePaginator
    {
        return $this->customerRepo->getAll($filters);
    }

    public function getCustomerById(int $id): ?Customer
    {
        return $this->customerRepo->findById($id);
    }



    public function updateCustomer(Customer $customer, array $data): bool
    {
        return $this->customerRepo->update($customer, $data);
    }



    public function updateAvatar(Customer $customer, \Illuminate\Http\UploadedFile $avatar): string
    {
        // Xoá ảnh cũ nếu có
        if ($customer->avatar_url) {
            $oldPath = ltrim(parse_url($customer->avatar_url, PHP_URL_PATH), '/'); // bỏ dấu /
            $oldPath = str_replace('storage/', '', $oldPath);
            Storage::disk('public')->delete($oldPath);
        }

        // Lấy tên gốc và tạo tên file mới tránh trùng
        $originalName = pathinfo($avatar->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $avatar->getClientOriginalExtension();
        $uniqueSuffix = now()->format('YmdHis') . '_' . uniqid();
        $fileName = $originalName . '_' . $uniqueSuffix . '.' . $extension;

        // Lưu file vào thư mục avatars
        $path = $avatar->storeAs('avatars', $fileName, 'public'); // trả về: avatars/abc.jpg

        // Trả về đường dẫn tương đối
        $relativePath = '/' . $path; // -> "/avatars/abc.jpg"

        // Cập nhật customer
        $customer->update(['avatar_url' => $relativePath]);

        return $relativePath;
    }



}