<?php

namespace App\Http\Requests\RentalContract;

use Illuminate\Foundation\Http\FormRequest;

class StoreRentalContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'exhibition_space_id' => 'required|exists:exhibition_spaces,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
        ];
    }

    public function messages(): array
    {
        return [
            'exhibition_space_id.required' => 'Vui lòng chọn không gian muốn thuê.',
            'exhibition_space_id.exists' => 'Không gian bạn chọn không tồn tại.',
            'start_date.required' => 'Vui lòng chọn ngày bắt đầu thuê.',
            'start_date.after_or_equal' => 'Ngày bắt đầu phải từ hôm nay trở đi.',
            'end_date.required' => 'Vui lòng chọn ngày kết thúc thuê.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.',
        ];
    }
}