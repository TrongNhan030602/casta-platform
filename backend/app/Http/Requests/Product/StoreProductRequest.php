<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\ShippingType;
use App\Enums\ProductTag;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255', 'unique:products,name'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],

            // ✅ Thương mại hóa
            'discount_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'discount_start_at' => ['nullable', 'date'],
            'discount_end_at' => ['nullable', 'date', 'after_or_equal:discount_start_at'],

            'weight' => ['nullable', 'numeric', 'min:0'],
            'dimensions' => ['nullable', 'array'],
            'dimensions.width' => ['nullable', 'numeric', 'min:0'],
            'dimensions.height' => ['nullable', 'numeric', 'min:0'],
            'dimensions.depth' => ['nullable', 'numeric', 'min:0'],

            'shipping_type' => ['nullable', new Enum(ShippingType::class)],
            'model_3d_url' => ['nullable', 'url'],
            'video_url' => ['nullable', 'url'],
            'tags' => ['nullable', 'array'],
            'tags.*' => [new Enum(ProductTag::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Vui lòng chọn danh mục.',
            'category_id.exists' => 'Danh mục không tồn tại.',
            'name.required' => 'Tên sản phẩm không được để trống.',
            'name.unique' => 'Tên sản phẩm đã tồn tại.',
            'price.required' => 'Giá sản phẩm là bắt buộc.',
            'discount_price.lt' => 'Giá khuyến mãi phải nhỏ hơn giá gốc.',
            'discount_end_at.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            'model_3d_url.url' => 'Link mô hình 3D không hợp lệ.',
            'video_url.url' => 'Link video không hợp lệ.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('tags'))) {
            $this->merge([
                'tags' => json_decode($this->input('tags'), true),
            ]);
        }
    }
}