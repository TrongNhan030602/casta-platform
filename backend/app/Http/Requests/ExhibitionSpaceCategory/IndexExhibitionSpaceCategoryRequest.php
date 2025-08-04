<?php

namespace App\Http\Requests\ExhibitionSpaceCategory;

use App\Models\ExhibitionSpaceCategory;
use Illuminate\Foundation\Http\FormRequest;

class IndexExhibitionSpaceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', ExhibitionSpaceCategory::class);
    }

    public function rules(): array
    {
        return [
            'keyword' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'in:id,name,description,parent_id'],
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
            'sort_by.in' => 'Trường sắp xếp không hợp lệ. Chỉ chấp nhận: id, name, description, parent_id.',
            'sort_order.in' => 'Thứ tự sắp xếp không hợp lệ. Chỉ chấp nhận: asc hoặc desc.',
            'per_page.integer' => 'Số lượng mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số lượng mỗi trang tối thiểu là 1.',
            'per_page.max' => 'Số lượng mỗi trang tối đa là 100.',
            'page.integer' => 'Trang phải là số nguyên.',
            'page.min' => 'Giá trị trang phải lớn hơn hoặc bằng 1.',
        ];
    }
}