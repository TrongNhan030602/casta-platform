<?php
namespace App\Http\Requests\ServiceCategory;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ServiceCategoryStatus;

class ServiceCategoryIndexRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'status' => ['nullable', 'in:' . implode(',', ServiceCategoryStatus::values())],
            'keyword' => ['nullable', 'string', 'max:255'],
            'deleted' => ['nullable', 'in:only,all,none'],
            'sort_by' => ['nullable', 'in:id,name,order,created_at'],
            'sort_order' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages()
    {
        return [
            'status.in' => 'Giá trị trạng thái không hợp lệ. Vui lòng chọn trong danh sách hợp lệ.',
            'keyword.string' => 'Từ khóa tìm kiếm phải là chuỗi ký tự.',
            'keyword.max' => 'Từ khóa tìm kiếm không được vượt quá 255 ký tự.',
            'deleted.in' => 'Giá trị lọc trạng thái xóa không hợp lệ. Phải là một trong: only, all, none.',
            'sort_by.in' => 'Trường sắp xếp không hợp lệ. Chỉ chấp nhận: id, name, order, created_at.',
            'sort_order.in' => 'Thứ tự sắp xếp không hợp lệ. Chỉ chấp nhận: asc hoặc desc.',
            'per_page.integer' => 'Số bản ghi trên trang phải là số nguyên.',
            'per_page.min' => 'Số bản ghi trên trang phải lớn hơn hoặc bằng 1.',
            'per_page.max' => 'Số bản ghi trên trang không được vượt quá 100.',
        ];
    }
}