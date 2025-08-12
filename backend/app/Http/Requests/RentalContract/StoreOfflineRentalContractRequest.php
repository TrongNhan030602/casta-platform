<?php

namespace App\Http\Requests\RentalContract;

use Illuminate\Foundation\Http\FormRequest;

class StoreOfflineRentalContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'enterprise_id' => ['required', 'exists:enterprises,id'],
            'exhibition_space_id' => ['required', 'exists:exhibition_spaces,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'additional_cost' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'enterprise_id.required' => 'Vui lòng chọn doanh nghiệp.',
            'enterprise_id.exists' => 'Doanh nghiệp không hợp lệ.',

            'exhibition_space_id.required' => 'Vui lòng chọn không gian triển lãm.',
            'exhibition_space_id.exists' => 'Không gian triển lãm không hợp lệ.',

            'start_date.required' => 'Vui lòng nhập ngày bắt đầu.',
            'start_date.date' => 'Ngày bắt đầu không đúng định dạng.',

            'end_date.required' => 'Vui lòng nhập ngày kết thúc.',
            'end_date.date' => 'Ngày kết thúc không đúng định dạng.',

            'unit_price.numeric' => 'Đơn giá phải là số.',
            'unit_price.min' => 'Đơn giá không được âm.',

            'additional_cost.numeric' => 'Chi phí thêm phải là số.',
            'additional_cost.min' => 'Chi phí thêm không được âm.',
        ];
    }
}