<?php

namespace App\Http\Requests\CustomerRequest;

use Illuminate\Foundation\Http\FormRequest;

class UploadCustomerAvatarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // policy kiểm tra trong controller
    }

    public function rules(): array
    {
        return [
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'avatar.required' => 'Ảnh đại diện là bắt buộc.',
            'avatar.image' => 'Tệp tải lên phải là ảnh.',
            'avatar.mimes' => 'Ảnh phải là jpeg, png, jpg hoặc webp.',
            'avatar.max' => 'Ảnh không được vượt quá 2MB.',
        ];
    }
}