<?php

namespace App\Http\Requests\ProductCategory;

use Illuminate\Foundation\Http\FormRequest;

class CategoryFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Đã kiểm tra policy tại controller
    }

    public function rules(): array
    {
        return [
            'keyword' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'is_active' => ['nullable', 'in:0,1'],
            'sort_by' => ['nullable', 'in:id,name,sort_order,is_active'],
            'sort_order' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'keyword.string' => 'Từ khóa phải là chuỗi ký tự.',
            'keyword.max' => 'Từ khóa không được vượt quá 255 ký tự.',

            'description.string' => 'Mô tả phải là chuỗi ký tự.',
            'description.max' => 'Mô tả không được vượt quá 255 ký tự.',

            'parent_id.integer' => 'ID danh mục cha phải là số nguyên.',
            'parent_id.exists' => 'ID danh mục cha không tồn tại trong hệ thống.',

            'is_active.in' => 'Trạng thái hoạt động chỉ nhận giá trị 0 hoặc 1.',

            'sort_by.in' => 'Trường sắp xếp không hợp lệ.',
            'sort_order.in' => 'Thứ tự sắp xếp phải là "asc" hoặc "desc".',

            'per_page.integer' => 'Số bản ghi mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số bản ghi mỗi trang phải lớn hơn 0.',
            'per_page.max' => 'Không được lấy quá 100 bản ghi mỗi trang.',

            'page.integer' => 'Số trang phải là số nguyên.',
            'page.min' => 'Số trang phải lớn hơn 0.',
        ];
    }
}