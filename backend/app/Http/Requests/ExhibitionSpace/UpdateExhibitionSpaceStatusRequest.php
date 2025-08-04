<?php

namespace App\Http\Requests\ExhibitionSpace;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\ExhibitionSpaceStatus;

class UpdateExhibitionSpaceStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(ExhibitionSpaceStatus::values())],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Vui lòng chọn trạng thái mới.',
            'status.in' => 'Trạng thái không hợp lệ.',
        ];
    }
}