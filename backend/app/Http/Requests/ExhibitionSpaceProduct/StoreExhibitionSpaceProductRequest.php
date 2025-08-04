<?php

namespace App\Http\Requests\ExhibitionSpaceProduct;

use Illuminate\Foundation\Http\FormRequest;

class StoreExhibitionSpaceProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Kiểm tra phân quyền ở policy hoặc service
    }

    public function rules(): array
    {
        return [
            'rental_contract_id' => ['required', 'exists:rental_contracts,id'],
            'product_id' => ['required', 'exists:products,id'],
            'note' => ['nullable', 'string', 'max:1000'],
            'position_metadata' => ['required', 'array'],
            'position_metadata.panoramaId' => ['required', 'string'],
            'position_metadata.yaw' => ['required', 'numeric'],
            'position_metadata.pitch' => ['required', 'numeric'],
            // bạn có thể bổ sung: zoom, label, v.v.
        ];
    }

    public function messages(): array
    {
        return [
            'position_metadata.required' => 'Thiếu dữ liệu vị trí — không biết bạn đang gán sản phẩm vào đâu!',
            'position_metadata.panoramaId.required' => 'Thiếu panoramaId —  Bạn chưa chọn góc nhìn cụ thể.',
            'position_metadata.panoramaId.string' => 'panoramaId không hợp lệ.',
            'position_metadata.yaw.required' => 'Thiếu yaw — vị trí ngang (trục Y) không xác định.',
            'position_metadata.yaw.numeric' => 'yaw phải là số hợp lệ.',
            'position_metadata.pitch.required' => 'Thiếu pitch — vị trí dọc (trục X) không xác định.',
            'position_metadata.pitch.numeric' => 'pitch phải là số hợp lệ.',
        ];
    }
}