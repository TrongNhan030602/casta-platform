<?php

namespace App\Http\Requests\EnterpriseRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\EnterpriseStatus;

class IndexEnterpriseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', Rule::in(EnterpriseStatus::values())],
            'search' => ['nullable', 'string', 'max:255'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'sort_by' => ['nullable', 'string', 'in:id,company_name,tax_code,email,representative,status'], // ✅ liệt kê các cột cho phép sort
            'sort_order' => ['nullable', Rule::in(['asc', 'desc'])],
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Trạng thái được chọn không hợp lệ.',
            'search.string' => 'Từ khóa tìm kiếm phải là chuỗi ký tự.',
            'search.max' => 'Từ khóa tìm kiếm không được vượt quá :max ký tự.',
            'per_page.integer' => 'Số lượng mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số lượng mỗi trang tối thiểu là :min.',
            'per_page.max' => 'Số lượng mỗi trang tối đa là :max.',
        ];
    }
}