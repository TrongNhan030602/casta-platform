<?php
namespace App\Http\Requests\RentalContract;

use Illuminate\Foundation\Http\FormRequest;

class RejectRentalContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reject_reason' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'reject_reason.required' => 'Vui lòng nhập lý do từ chối.',
            'reject_reason.string' => 'Lý do từ chối phải là chuỗi ký tự.',
            'reject_reason.max' => 'Lý do từ chối không được vượt quá 255 ký tự.',
        ];
    }
}