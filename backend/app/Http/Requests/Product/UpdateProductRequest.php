<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\ShippingType;
use App\Enums\ProductTag;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'exists:categories,id'],
            'name' => ['sometimes', 'string', 'max:255', 'unique:products,name,' . $this->route('id')],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],

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
            'category_id.exists' => 'Danh mục không tồn tại.',
            'name.unique' => 'Tên sản phẩm đã tồn tại.',
            'name.string' => 'Tên sản phẩm phải là chuỗi.',
            'price.numeric' => 'Giá sản phẩm phải là số.',
            'price.min' => 'Giá sản phẩm không được nhỏ hơn 0.',
            'discount_price.lt' => 'Giá khuyến mãi phải nhỏ hơn giá gốc.',
            'discount_end_at.after_or_equal' => 'Thời gian kết thúc phải sau hoặc bằng thời gian bắt đầu.',
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