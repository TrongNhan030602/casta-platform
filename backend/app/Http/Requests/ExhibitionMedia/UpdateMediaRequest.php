<?php

namespace App\Http\Requests\ExhibitionMedia;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\MediaType;
use Illuminate\Validation\Rule;

class UpdateMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $type = $this->input('type');

        return [
            'type' => ['sometimes', Rule::in(MediaType::values())],

            'file' => $type === MediaType::YOUTUBE->value
                ? ['nullable']
                : ['sometimes', 'file', 'mimes:jpg,jpeg,png,webp,mp4,pdf,doc,docx'],

            'url' => $type === MediaType::YOUTUBE->value
                ? ['sometimes', 'required', 'url', 'max:255']
                : ['nullable'],

            'caption' => ['nullable', 'string', 'max:255'],
            'order' => ['nullable', 'integer'],
            'metadata' => ['nullable', 'json'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.file' => 'File không hợp lệ.',
            'file.mimes' => 'Định dạng file không hỗ trợ (jpg, jpeg, png, webp, mp4, pdf, doc, docx).',
            'url.required' => 'Vui lòng nhập đường dẫn YouTube.',
            'url.url' => 'Đường dẫn không hợp lệ.',
            'type.in' => 'Loại media không hợp lệ.',
        ];
    }
}