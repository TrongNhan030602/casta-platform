<?php

namespace App\Http\Requests\Product;

use App\Enums\ProductTag;
use App\Enums\ShippingType;
use App\Enums\ProductStatus;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class AdminUpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'enterprise_id' => ['sometimes', 'exists:enterprises,id'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'name' => ['sometimes', 'string', 'max:255', 'unique:products,name,' . $this->route('id')],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'status' => [
                'sometimes',
                Rule::in([
                    ProductStatus::DRAFT->value,
                    ProductStatus::DISABLED->value,
                    ProductStatus::PENDING->value,
                ]),
            ],


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

            'views_count' => ['nullable', 'integer', 'min:0'],
            'purchased_count' => ['nullable', 'integer', 'min:0'],
            'reviews_count' => ['nullable', 'integer', 'min:0'],
            'average_rating' => ['nullable', 'numeric', 'between:0,5'],

            'model_3d_url' => ['nullable', 'url'],
            'video_url' => ['nullable', 'url'],
            'tags' => ['nullable', 'array'],
            'tags.*' => [new Enum(ProductTag::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'enterprise_id.exists' => 'Doanh nghiệp không tồn tại.',
            'category_id.exists' => 'Danh mục không tồn tại.',
            'name.unique' => 'Tên sản phẩm đã tồn tại.',
            'price.numeric' => 'Giá sản phẩm phải là số.',
            'discount_price.lt' => 'Giá khuyến mãi phải nhỏ hơn giá gốc.',
            'discount_end_at.after_or_equal' => 'Thời gian kết thúc khuyến mãi phải sau hoặc bằng thời gian bắt đầu.',
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