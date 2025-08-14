<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class MediaUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'meta' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'meta.array' => 'Thông tin meta phải ở dạng mảng.',
        ];
    }
}