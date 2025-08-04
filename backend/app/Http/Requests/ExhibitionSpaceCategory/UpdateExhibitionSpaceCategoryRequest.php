<?php

namespace App\Http\Requests\ExhibitionSpaceCategory;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExhibitionSpaceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:exhibition_space_categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên là bắt buộc.',
            'name.string' => 'Tên phải là một chuỗi.',
            'name.max' => 'Tên không được vượt quá 255 ký tự.',
            'description.string' => 'Mô tả phải là một chuỗi.',
            'parent_id.exists' => 'Danh mục cha được chọn không tồn tại.',
        ];
    }
}