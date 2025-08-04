<?php
namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ProductStatus;

class PublicSearchProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'keyword' => 'nullable|string|max:255',
            'category_id' => 'nullable|integer|exists:categories,id',
            'enterprise_name' => 'nullable|string|max:255',

            'price_min' => 'nullable|numeric|min:0',
            'price_max' => 'nullable|numeric|min:0',

            'status' => 'nullable|in:' . implode(',', ProductStatus::values()),

            'sort_by' => 'nullable|in:id,name,price,created_at',
            'sort_order' => 'nullable|in:asc,desc',

            'per_page' => 'nullable|integer|min:1|max:100',
            'deleted' => ['nullable', 'in:only,all,none'],
            'enterprise_id' => 'nullable|integer|exists:enterprises,id',

        ];
    }

    public function messages(): array
    {
        return [
            'keyword.string' => 'Từ khoá tìm kiếm phải là chuỗi.',
            'keyword.max' => 'Từ khoá tìm kiếm không được vượt quá 255 ký tự.',

            'category_id.integer' => 'Danh mục không hợp lệ.',
            'category_id.exists' => 'Danh mục không tồn tại.',

            'enterprise_name.string' => 'Tên doanh nghiệp phải là chuỗi.',
            'enterprise_name.max' => 'Tên doanh nghiệp không được vượt quá 255 ký tự.',

            'price_min.numeric' => 'Giá tối thiểu phải là số.',
            'price_min.min' => 'Giá tối thiểu phải lớn hơn hoặc bằng 0.',
            'price_max.numeric' => 'Giá tối đa phải là số.',
            'price_max.min' => 'Giá tối đa phải lớn hơn hoặc bằng 0.',

            'status.in' => 'Trạng thái không hợp lệ.',

            'sort_by.in' => 'Chỉ được sắp xếp theo name, price hoặc created_at.',
            'sort_order.in' => 'Thứ tự sắp xếp phải là asc hoặc desc.',

            'per_page.integer' => 'Số lượng mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số lượng mỗi trang phải ít nhất là 1.',
            'per_page.max' => 'Số lượng mỗi trang tối đa là 100.',
            'enterprise_id.integer' => 'ID doanh nghiệp không hợp lệ.',
            'enterprise_id.exists' => 'Doanh nghiệp không tồn tại.',

        ];
    }
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->filled('price_min') && $this->filled('price_max')) {
                if ($this->price_min > $this->price_max) {
                    $validator->errors()->add('price_max', 'Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu.');
                }
            }
        });
    }
    // Nếu không phải QTHT thì không cho phép lọc theo enterprise_id
    protected function prepareForValidation()
    {
        $user = auth()->user();

        if (!$user || !$user->isSystemUser()) {
            $this->merge(['enterprise_id' => null]);
        }
    }

}