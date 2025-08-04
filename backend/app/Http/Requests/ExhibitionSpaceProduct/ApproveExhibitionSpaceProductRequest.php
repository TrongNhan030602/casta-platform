<?php

namespace App\Http\Requests\ExhibitionSpaceProduct;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\ExhibitionProductStatus;

class ApproveExhibitionSpaceProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Quyền xử lý được check tại Controller qua policy
    }

    public function rules(): array
    {
        $rules = [
            'status' => [
                'required',
                Rule::in([
                    ExhibitionProductStatus::APPROVED->value,
                    ExhibitionProductStatus::REJECTED->value,
                ])
            ],
            'note' => ['nullable', 'string'],
        ];

        if ($this->input('status') === ExhibitionProductStatus::REJECTED->value) {
            $rules['note'] = ['required', 'string'];
        }

        return $rules;
    }


    public function messages(): array
    {
        return [
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.in' => 'Trạng thái không hợp lệ.',
            'note.required' => 'Vui lòng ghi rõ lý do từ chối.'

        ];
    }
}