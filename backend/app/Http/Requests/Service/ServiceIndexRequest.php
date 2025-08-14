<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ServiceStatus;

class ServiceIndexRequest extends FormRequest
{
    public function authorize()
    {
        return true; // quyền được kiểm tra ở controller
    }

    public function rules()
    {
        return [
            'deleted' => ['nullable', 'string', 'in:none,only,all'],
            'status' => ['nullable', 'string', 'in:' . implode(',', ServiceStatus::values())],
            'category_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'keyword' => ['nullable', 'string'],
            'sort_by' => ['nullable', 'string', 'in:id,created_at,name,price'],
            'sort_order' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:200'],
        ];
    }

    public function messages()
    {
        return [
            'deleted.in' => 'Giá trị deleted phải là one of: none, only, all.',
            'status.in' => 'Trạng thái không hợp lệ.',
            'category_id.integer' => 'Category ID phải là số nguyên.',
            'category_id.exists' => 'Danh mục dịch vụ không tồn tại.',
            'keyword.string' => 'Từ khóa phải là chuỗi.',
            'sort_by.in' => 'Trường sắp xếp không hợp lệ. Chỉ được chọn: id, created_at, name, price.',
            'sort_order.in' => 'Thứ tự sắp xếp không hợp lệ. Chỉ được chọn: asc hoặc desc.',
            'per_page.integer' => 'Số bản ghi mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số bản ghi mỗi trang phải >= 1.',
            'per_page.max' => 'Số bản ghi mỗi trang phải <= 200.',
        ];
    }
}