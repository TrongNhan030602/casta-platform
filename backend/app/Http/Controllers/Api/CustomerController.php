<?php

namespace App\Http\Controllers\Api;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Services\CustomerService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\CustomerRequest\UpdateCustomerRequest;
use App\Http\Requests\CustomerRequest\UploadCustomerAvatarRequest;

class CustomerController extends Controller
{
    use AuthorizesRequests;

    protected CustomerService $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    public function index(Request $request): JsonResponse
    {
        // Tạm thời chưa phân quyền tại đây, vì có thể lọc theo user phía service
        $customers = $this->customerService->getCustomers($request->all());
        return response()->json($customers);
    }

    public function show(int $id): JsonResponse
    {
        try {
            $customer = $this->customerService->getCustomerById($id);

            if (!$customer) {
                return response()->json(['message' => 'Không tìm thấy khách hàng'], 404);
            }

            $this->authorize('view', $customer);

            return response()->json($customer);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => 'Bạn không có quyền xem khách hàng này.'], 403);
        }
    }


    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        try {
            $this->authorize('update', $customer);

            $this->customerService->updateCustomer($customer, $request->validated());

            return response()->json(['message' => 'Cập nhật thông tin khách hàng thành công.']);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => 'Bạn không có quyền cập nhật khách hàng này.'], 403);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Lỗi cập nhật thông tin khách hàng.', 'error' => $e->getMessage()], 500);
        }
    }



    public function uploadAvatar(UploadCustomerAvatarRequest $request, Customer $customer): JsonResponse
    {
        try {
            $this->authorize('uploadAvatar', $customer);

            $url = $this->customerService->updateAvatar($customer, $request->file('avatar'));

            return response()->json([
                'message' => 'Cập nhật ảnh đại diện thành công.',
                'avatar_url' => $url
            ]);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => 'Bạn không có quyền cập nhật ảnh đại diện.'], 403);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Lỗi cập nhật ảnh đại diện.', 'error' => $e->getMessage()], 500);
        }
    }
}