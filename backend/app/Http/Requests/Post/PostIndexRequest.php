<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\PostType;
use App\Enums\PostStatus;

class PostIndexRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Quyền kiểm tra ở controller
    }

    public function rules(): array
    {
        return [
            'type' => ['nullable', 'string', 'in:' . implode(',', PostType::values())],
            'status' => ['nullable', 'string', 'in:' . implode(',', PostStatus::values())],
            'category_id' => ['nullable', 'integer', 'exists:news_categories,id'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'tags' => ['nullable', 'string'], // Chuỗi id tag, phân tách dấu phẩy
            'keyword' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'in:id,published_at,title,created_at'],
            'sort_order' => ['nullable', 'string', 'in:asc,desc'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'deleted' => ['nullable', 'string', 'in:only,all,none'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.in' => 'Loại bài viết không hợp lệ.',
            'status.in' => 'Trạng thái bài viết không hợp lệ.',
            'category_id.exists' => 'Danh mục tin tức không tồn tại.',
            'date_to.after_or_equal' => 'Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.',
            'sort_by.in' => 'Tham số sắp xếp không hợp lệ.',
            'sort_order.in' => 'Thứ tự sắp xếp phải là asc hoặc desc.',
            'per_page.max' => 'Số bản ghi mỗi trang tối đa là 100.',
            'deleted.in' => 'Tham số deleted không hợp lệ.',
        ];
    }
}