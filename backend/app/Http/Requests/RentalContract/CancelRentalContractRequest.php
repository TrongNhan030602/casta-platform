<?php
namespace App\Http\Requests\RentalContract;

use Illuminate\Foundation\Http\FormRequest;

class CancelRentalContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cancel_reason' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'cancel_reason.string' => 'Lý do hủy phải là chuỗi ký tự.',
            'cancel_reason.max' => 'Lý do hủy không được vượt quá 255 ký tự.',
        ];
    }
}