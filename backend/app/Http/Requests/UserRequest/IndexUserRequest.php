<?php

namespace App\Http\Requests\UserRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\UserRole;
use App\Enums\UserStatus;

class IndexUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Hoặc để true nếu bạn đã kiểm soát bằng Gate trong controller
        return true;
    }

    public function rules(): array
    {
        return [
            'role' => [
                'nullable',
                Rule::in(UserRole::values()),
            ],
            'status' => [
                'nullable',
                Rule::in(UserStatus::values()),
            ],
            'keyword' => [
                'nullable',
                'string',
                'max:255',
            ],
            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
            'sort_by' => ['nullable', Rule::in(['id', 'name', 'email', 'role', 'status'])],
            'sort_order' => ['nullable', Rule::in(['asc', 'desc'])],

        ];
    }

    public function messages(): array
    {
        return [
            'role.in' => 'Vai trò không hợp lệ.',
            'status.in' => 'Trạng thái không hợp lệ.',
            'per_page.integer' => 'Số lượng mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số lượng mỗi trang tối thiểu là 1.',
            'per_page.max' => 'Số lượng mỗi trang tối đa là 100.',
            'sort_by.in' => 'Trường sắp xếp không hợp lệ.',
            'sort_order.in' => 'Thứ tự sắp xếp phải là asc hoặc desc.',

        ];
    }
}