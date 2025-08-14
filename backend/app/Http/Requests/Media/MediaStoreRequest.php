<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class MediaStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => 'required|file|max:10240', // 10MB
            'meta' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Vui lòng chọn file để tải lên.',
            'file.file' => 'File tải lên không hợp lệ.',
            'file.max' => 'Dung lượng file tối đa là 10MB.',
            'meta.array' => 'Thông tin meta phải ở dạng mảng.',
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('meta') && is_string($this->meta)) {
            $this->merge([
                'meta' => json_decode($this->meta, true) ?: [],
            ]);
        }
    }

}