<?php

namespace App\Http\Requests\Product;

use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ProductStatus;

class UpdateProductStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', new Enum(ProductStatus::class)],
            'reason_rejected' => ['nullable', 'string', 'required_if:status,rejected'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Trạng thái duyệt là bắt buộc.',
            'reason_rejected.required_if' => 'Cần cung cấp lý do khi từ chối.',
        ];
    }
}