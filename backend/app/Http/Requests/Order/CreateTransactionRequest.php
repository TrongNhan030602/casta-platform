<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\TransactionStatus;
use App\Enums\TransactionMethod;

class CreateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['required', 'string', 'in:' . implode(',', TransactionMethod::values())],
            'status' => ['nullable', 'string', 'in:' . implode(',', TransactionStatus::values())],
            'reference_code' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:1000'],
            'paid_at' => ['nullable', 'date'],
            'sub_order_id' => ['nullable', 'integer', 'exists:sub_orders,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Số tiền thanh toán là bắt buộc.',
            'amount.numeric' => 'Số tiền phải là số.',
            'amount.min' => 'Số tiền phải lớn hơn 0.',
            'method.required' => 'Phương thức thanh toán là bắt buộc.',
            'method.in' => 'Phương thức thanh toán không hợp lệ.',
            'status.in' => 'Trạng thái giao dịch không hợp lệ.',
            'sub_order_id.exists' => 'SubOrder không tồn tại.',
        ];
    }
}