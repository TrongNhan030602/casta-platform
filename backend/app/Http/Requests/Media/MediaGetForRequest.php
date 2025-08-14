<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class MediaGetForRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|string|in:post,service',
            'id' => 'required|integer', // đổi từ model_id -> id
            'role' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Vui lòng cung cấp loại model (post/service).',
            'type.in' => 'Loại model không hợp lệ.',
            'id.required' => 'Vui lòng cung cấp ID của model.',
        ];
    }
}