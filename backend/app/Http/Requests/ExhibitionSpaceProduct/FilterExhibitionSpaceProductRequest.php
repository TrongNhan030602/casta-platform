<?php

namespace App\Http\Requests\ExhibitionSpaceProduct;


use App\Enums\ExhibitionProductStatus;
use Illuminate\Foundation\Http\FormRequest;

class FilterExhibitionSpaceProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // hoặc kiểm tra quyền admin nếu muốn
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', 'in:' . implode(',', ExhibitionProductStatus::values())],
            'contract_id' => ['nullable', 'exists:rental_contracts,id'],
            'enterprise_id' => ['nullable', 'exists:enterprises,id'],
            'enterprise_id.exists' => 'Doanh nghiệp không tồn tại.',
            'product_id' => ['nullable', 'exists:products,id'],
            'keyword' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'in:created_at,updated_at,id'],
            'sort_order' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
    public function messages(): array
    {
        return [
            'status.in' => 'Trạng thái không hợp lệ. Giá trị hợp lệ: ' . implode(', ', ExhibitionProductStatus::values()),
            'contract_id.exists' => 'Hợp đồng không tồn tại.',
            'product_id.exists' => 'Sản phẩm không tồn tại.',
            'sort_by.in' => 'Chỉ được sắp xếp theo: created_at, updated_at.',
            'sort_order.in' => 'Thứ tự sắp xếp phải là asc hoặc desc.',
            'per_page.*' => 'Số lượng mỗi trang phải nằm trong khoảng 1 đến 100.',
        ];
    }

}