<?php

namespace App\Http\Requests\RentalContract;

use Illuminate\Foundation\Http\FormRequest;

class HandleExtendRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => 'required|in:approve,reject',
            'new_end_date' => 'required_if:action,approve|date|after:today',
            'reject_reason' => 'required_if:action,reject|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'action.required' => 'Hành động là bắt buộc.',
            'action.in' => 'Hành động phải là "approve" hoặc "reject".',

            'new_end_date.required_if' => 'Ngày kết thúc mới là bắt buộc khi chấp nhận gia hạn.',
            'new_end_date.date' => 'Ngày kết thúc mới không hợp lệ.',
            'new_end_date.after' => 'Ngày kết thúc mới phải sau ngày hôm nay.',

            'reject_reason.required_if' => 'Lý do từ chối là bắt buộc khi từ chối gia hạn.',
            'reject_reason.string' => 'Lý do từ chối phải là chuỗi.',
            'reject_reason.max' => 'Lý do từ chối tối đa :max ký tự.',
        ];
    }


}