<?php

namespace App\Http\Requests\ExhibitionMedia;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\MediaType;
use Illuminate\Validation\Rule;

class UploadMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $type = $this->input('type');

        return [
            'type' => ['required', Rule::in(MediaType::values())],

            // Nếu là YouTube thì yêu cầu URL, ngược lại yêu cầu file upload
            'file' => $type === MediaType::YOUTUBE->value
                ? ['nullable']
                : ['required', 'file', 'mimes:jpg,jpeg,png,webp,mp4,pdf,doc,docx'],

            'url' => $type === MediaType::YOUTUBE->value
                ? ['required', 'url', 'max:255']
                : ['nullable'],

            'caption' => ['nullable', 'string', 'max:255'],
            'order' => ['nullable', 'integer'],
            'metadata' => ['nullable', 'json'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Vui lòng chọn loại media.',
            'type.in' => 'Loại media không hợp lệ.',
            'file.required' => 'Vui lòng chọn file để tải lên.',
            'file.mimes' => 'Định dạng file không hỗ trợ (jpg, jpeg, png, webp, mp4, pdf, doc, docx).',
            'url.required' => 'Vui lòng nhập đường dẫn YouTube.',
            'url.url' => 'Đường dẫn không hợp lệ.',
        ];
    }
}