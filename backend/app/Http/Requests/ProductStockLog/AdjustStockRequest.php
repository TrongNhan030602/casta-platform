<?php

namespace App\Http\Requests\ProductStockLog;

use App\Enums\ProductStockLogType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdjustStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(ProductStockLogType::values())],
            'quantity' => ['required', 'integer', 'min:1'],
            'note' => ['nullable', 'string', 'max:255'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'affect_cost' => ['nullable', 'boolean'], // Cho phép truyền override
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Loại điều chỉnh là bắt buộc.',
            'type.in' => 'Loại điều chỉnh không hợp lệ. Chỉ chấp nhận: ' . implode(', ', ProductStockLogType::values()) . '.',

            'quantity.required' => 'Vui lòng nhập số lượng.',
            'quantity.integer' => 'Số lượng phải là số nguyên.',
            'quantity.min' => 'Số lượng tối thiểu là 1.',

            'note.string' => 'Ghi chú phải là chuỗi văn bản.',
            'note.max' => 'Ghi chú không được vượt quá 255 ký tự.',

            'unit_price.numeric' => 'Đơn giá phải là số.',
            'unit_price.min' => 'Đơn giá phải lớn hơn hoặc bằng 0.',

            'affect_cost.boolean' => 'Giá trị affect_cost chỉ chấp nhận true hoặc false.',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $typeValue = $this->input('type');
            $unitPrice = $this->input('unit_price');

            if (!$typeValue || !in_array($typeValue, ProductStockLogType::values())) {
                return;
            }

            $typeEnum = ProductStockLogType::from($typeValue);

            // ✅ Xác định affect_cost: nếu không truyền thì lấy mặc định
            $affectCost = $this->has('affect_cost')
                ? (bool) $this->input('affect_cost')
                : $typeEnum->affectCostByDefault();

            // ✅ Nếu ảnh hưởng giá vốn → yêu cầu đơn giá > 0
            if (
                $affectCost &&
                $typeEnum->isImport() &&
                (is_null($unitPrice) || $unitPrice <= 0)
            ) {
                $validator->errors()->add(
                    'unit_price',
                    'Đơn giá là bắt buộc và phải lớn hơn 0 với loại này khi ảnh hưởng đến giá vốn.'
                );
            }

            // ❌ Nếu KHÔNG ảnh hưởng giá vốn → cấm nhập đơn giá
            if (
                !$affectCost &&
                !is_null($unitPrice)
            ) {
                $validator->errors()->add(
                    'unit_price',
                    'Không cần nhập đơn giá với loại "' . $typeEnum->label() . '" vì không ảnh hưởng giá vốn.'
                );
            }
        });
    }
}