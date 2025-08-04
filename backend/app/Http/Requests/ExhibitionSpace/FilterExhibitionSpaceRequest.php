<?php
namespace App\Http\Requests\ExhibitionSpace;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ExhibitionSpaceStatus;
use Illuminate\Validation\Rule;

class FilterExhibitionSpaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Có thể chỉnh theo quyền
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', Rule::in(ExhibitionSpaceStatus::values())],
            'keyword' => ['nullable', 'string', 'max:255'],
            'zone' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'integer', 'exists:exhibition_space_categories,id'],
            'price_min' => ['nullable', 'numeric', 'min:0'],
            'price_max' => ['nullable', 'numeric', 'gte:price_min'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'sort_by' => ['nullable', Rule::in(['id', 'code', 'name', 'location', 'zone', 'price', 'status', 'created_at'])],
            'sort_order' => ['nullable', Rule::in(['asc', 'desc'])],

        ];
    }
    public function messages(): array
    {
        return [
            'status.in' => 'Trạng thái không hợp lệ.',
            'keyword.string' => 'Từ khóa tìm kiếm phải là chuỗi.',
            'keyword.max' => 'Từ khóa không được vượt quá 255 ký tự.',
            'zone.string' => 'Khu vực phải là chuỗi.',
            'zone.max' => 'Khu vực không được vượt quá 100 ký tự.',
            'category_id.integer' => 'ID danh mục phải là số nguyên.',
            'category_id.exists' => 'Danh mục không tồn tại.',
            'price_min.numeric' => 'Giá tối thiểu phải là số.',
            'price_min.min' => 'Giá tối thiểu phải lớn hơn hoặc bằng 0.',
            'price_max.numeric' => 'Giá tối đa phải là số.',
            'price_max.gte' => 'Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu.',
            'per_page.integer' => 'Số bản ghi mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số bản ghi mỗi trang tối thiểu là 1.',
            'per_page.max' => 'Số bản ghi mỗi trang tối đa là 100.',
            'sort_by.in' => 'Trường sắp xếp không hợp lệ. Các giá trị hợp lệ gồm: id, code, name, location, zone, price, status, created_at.',
            'sort_order.in' => 'Thứ tự sắp xếp không hợp lệ. Chỉ chấp nhận "asc" hoặc "desc".',
        ];
    }


}