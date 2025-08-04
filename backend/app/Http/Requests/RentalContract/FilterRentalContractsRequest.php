<?php

namespace App\Http\Requests\RentalContract;

use App\Enums\RentalContractStatus;
use Illuminate\Foundation\Http\FormRequest;

class FilterRentalContractsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'nullable|in:' . implode(',', RentalContractStatus::values()),
            'keyword' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'sort_by' => 'nullable|in:id,start_date,end_date,created_at',
            'sort_order' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
            'has_extend_request' => 'nullable|boolean',

        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Trạng thái không hợp lệ.',
            'keyword.string' => 'Từ khóa phải là chuỗi.',
            'keyword.max' => 'Từ khóa tối đa :max ký tự.',
            'start_date.date' => 'Ngày bắt đầu không hợp lệ.',
            'end_date.date' => 'Ngày kết thúc không hợp lệ.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            'sort_by.in' => 'Trường sắp xếp không hợp lệ.',
            'sort_order.in' => 'Thứ tự sắp xếp phải là asc hoặc desc.',
            'per_page.integer' => 'Số bản ghi mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số bản ghi mỗi trang tối thiểu là :min.',
            'per_page.max' => 'Số bản ghi mỗi trang tối đa là :max.',
            'has_extend_request.boolean' => 'Trường lọc yêu cầu gia hạn phải là true hoặc false.',

        ];
    }
    protected function prepareForValidation()
    {
        if ($this->has('has_extend_request')) {
            $this->merge([
                'has_extend_request' => filter_var($this->input('has_extend_request'), FILTER_VALIDATE_BOOLEAN),
            ]);
        }
    }

}