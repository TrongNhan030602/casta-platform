<?php

namespace App\Http\Requests\Tag;

use Illuminate\Foundation\Http\FormRequest;

class TagFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'with_trashed' => filter_var($this->with_trashed, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            'only_trashed' => filter_var($this->only_trashed, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
        ]);
    }

    public function rules(): array
    {
        return [
            'q' => 'nullable|string|max:255',
            'sort_by' => 'nullable|in:id,name,slug',
            'sort_order' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
            'with_trashed' => 'nullable|boolean',
            'only_trashed' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'q.string' => 'Từ khóa tìm kiếm phải là chuỗi.',
            'q.max' => 'Từ khóa tìm kiếm không được dài quá 255 ký tự.',
            'sort_by.in' => 'Trường sắp xếp không hợp lệ.',
            'sort_order.in' => 'Thứ tự sắp xếp phải là "asc" hoặc "desc".',
            'per_page.integer' => 'Số lượng hiển thị phải là số nguyên.',
            'per_page.min' => 'Số lượng hiển thị tối thiểu là 1.',
            'per_page.max' => 'Số lượng hiển thị tối đa là 100.',
            'with_trashed.boolean' => 'Giá trị with_trashed phải là true hoặc false.',
            'only_trashed.boolean' => 'Giá trị only_trashed phải là true hoặc false.',
        ];
    }

    public function filters(): array
    {
        return [
            'q' => $this->input('q'),
            'sort_by' => $this->input('sort_by', 'name'),
            'sort_order' => $this->input('sort_order', 'asc'),
            'per_page' => $this->input('per_page', 15),
            'with_trashed' => $this->input('with_trashed', false),
            'only_trashed' => $this->input('only_trashed', false),
        ];
    }
}