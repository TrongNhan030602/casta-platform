<?php
namespace App\Http\Requests\ProductStockLog;

use Illuminate\Foundation\Http\FormRequest;

class GetProductStockLogsRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Authorization handled in controller
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['nullable', 'string'], // nếu bạn có danh sách cụ thể thì dùng in:import,export,...
            'keyword' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'in:created_at,quantity,unit_price,stock_after,avg_cost_after'],
            'sort_order' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
    public function messages(): array
    {
        return [
            'type.string' => 'Trường loại phải là chuỗi.',
            'keyword.string' => 'Từ khoá tìm kiếm phải là chuỗi.',
            'keyword.max' => 'Từ khoá tìm kiếm không được dài quá 255 ký tự.',

            'sort_by.in' => 'Trường sắp xếp không hợp lệ. Các giá trị hợp lệ: created_at, quantity, unit_price, stock_after, avg_cost_after.',
            'sort_order.in' => 'Thứ tự sắp xếp không hợp lệ. Giá trị hợp lệ: asc hoặc desc.',

            'per_page.integer' => 'Số bản ghi mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số bản ghi mỗi trang tối thiểu là 1.',
            'per_page.max' => 'Số bản ghi mỗi trang tối đa là 100.',
        ];
    }

}