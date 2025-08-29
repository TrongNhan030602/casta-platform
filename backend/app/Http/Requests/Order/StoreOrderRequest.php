<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_address' => ['required', 'string', 'max:500'],
            'shipping_phone' => ['required', 'string', 'max:20'],
            'note' => ['nullable', 'string', 'max:1000'],

            // ✅ validate method, status theo enum
            'payment_method' => ['sometimes', 'string', 'in:' . implode(',', PaymentMethod::values())],
            'payment_status' => ['sometimes', 'string', 'in:' . implode(',', PaymentStatus::values())],

            // Danh sách items
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'shipping_address.required' => 'Vui lòng nhập địa chỉ giao hàng.',
            'shipping_phone.required' => 'Vui lòng nhập số điện thoại nhận hàng.',
            'items.required' => 'Đơn hàng phải có ít nhất 1 sản phẩm.',
            'items.*.product_id.exists' => 'Sản phẩm không tồn tại.',
            'items.*.quantity.min' => 'Số lượng sản phẩm phải lớn hơn 0.',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ.',
            'payment_status.in' => 'Trạng thái thanh toán không hợp lệ.',
        ];
    }
}