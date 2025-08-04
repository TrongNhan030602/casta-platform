<?php

namespace App\Http\Requests\Feedback;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\FeedbackType;
use App\Enums\FeedbackStatus;

class FilterFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'nullable|in:' . implode(',', FeedbackType::values()),
            'status' => 'nullable|in:' . implode(',', FeedbackStatus::values()),
            'target_id' => 'nullable|integer|min:1',
            'user_id' => 'nullable|integer|min:1',
            'keyword' => 'nullable|string|max:255',
            'sort_by' => 'nullable|in:id,rating,created_at,updated_at',
            'sort_order' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'type.in' => 'Loại phản hồi không hợp lệ.',
            'status.in' => 'Trạng thái phản hồi không hợp lệ.',
            'target_id.integer' => 'ID mục tiêu phải là số nguyên.',
            'target_id.min' => 'ID mục tiêu phải lớn hơn 0.',
            'user_id.integer' => 'ID người dùng phải là số nguyên.',
            'user_id.min' => 'ID người dùng phải lớn hơn 0.',
            'keyword.string' => 'Từ khoá phải là chuỗi.',
            'keyword.max' => 'Từ khoá không được vượt quá 255 ký tự.',
            'sort_by.in' => 'Trường sắp xếp không hợp lệ.',
            'sort_order.in' => 'Thứ tự sắp xếp phải là "asc" hoặc "desc".',
            'per_page.integer' => 'Số lượng mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số lượng mỗi trang phải lớn hơn 0.',
            'per_page.max' => 'Không thể lấy quá 100 phản hồi mỗi trang.',
        ];
    }



}