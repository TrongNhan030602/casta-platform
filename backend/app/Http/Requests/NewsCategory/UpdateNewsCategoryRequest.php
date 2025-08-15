<?php
namespace App\Http\Requests\NewsCategory;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\NewsCategoryStatus;

class UpdateNewsCategoryRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Kiểm tra quyền ở controller hoặc policy
    }

    public function rules()
    {
        $categoryId = $this->route('id'); // ID hiện tại

        return [
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                // Bỏ qua bản ghi hiện tại để không báo trùng
                Rule::unique('news_categories', 'slug')->ignore($categoryId),
            ],
            'parent_id' => [
                'nullable',
                'exists:news_categories,id',
                'not_in:' . $categoryId, // không được trùng chính nó
            ],
            'description' => 'nullable|string',
            'image_id' => 'nullable|exists:media,id',
            'order' => 'nullable|integer|min:0',
            'status' => ['required', 'in:' . implode(',', NewsCategoryStatus::values())],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên danh mục là bắt buộc.',
            'name.string' => 'Tên danh mục phải là chuỗi ký tự.',
            'name.max' => 'Tên danh mục không được vượt quá 255 ký tự.',

            'slug.required' => 'Slug là bắt buộc.',
            'slug.string' => 'Slug phải là chuỗi ký tự.',
            'slug.max' => 'Slug không được vượt quá 255 ký tự.',
            'slug.unique' => 'Slug đã tồn tại, vui lòng chọn slug khác.',

            'parent_id.exists' => 'Danh mục cha không hợp lệ.',
            'parent_id.not_in' => 'Danh mục cha không được trùng với chính danh mục hiện tại.',

            'description.string' => 'Mô tả phải là chuỗi ký tự.',

            'image_id.exists' => 'Ảnh không tồn tại.',

            'order.integer' => 'Thứ tự phải là số nguyên.',
            'order.min' => 'Thứ tự phải là số nguyên không âm.',

            'status.required' => 'Trạng thái là bắt buộc.',
            'status.in' => 'Trạng thái không hợp lệ.',
        ];
    }
}