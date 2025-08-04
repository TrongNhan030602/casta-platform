<?php

namespace App\Http\Requests\UserRequest;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\UserStatus;
use Illuminate\Validation\Rules\Enum;

class ReviewEnterpriseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy xử lý trong controller rồi
    }

    public function rules(): array
    {
        return [
            'status' => ['required', new Enum(UserStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Vui lòng chọn trạng thái duyệt.',
            'status.enum' => 'Trạng thái không hợp lệ.',
        ];
    }
}