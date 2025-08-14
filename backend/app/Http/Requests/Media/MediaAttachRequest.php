<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class MediaAttachRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|string|in:post,service',
            'id' => 'required|integer',              // đổi từ model_id -> id
            'media_ids' => 'required|array',
            'media_ids.*' => 'integer',
            'role' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Vui lòng cung cấp loại model (post/service).',
            'type.in' => 'Loại model không hợp lệ.',
            'id.required' => 'Vui lòng cung cấp ID của model.',
            'media_ids.required' => 'Vui lòng cung cấp ít nhất một Media ID.',
            'media_ids.array' => 'media_ids phải là một mảng.',
            'media_ids.*.integer' => 'Mỗi Media ID phải là số.',
        ];
    }



}