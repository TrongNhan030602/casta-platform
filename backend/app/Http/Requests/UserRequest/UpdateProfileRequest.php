<?php

namespace App\Http\Requests\UserRequest;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\StrongPassword;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Đã login, quyền được kiểm ở Controller
    }

    public function rules(): array
    {
        $userId = auth()->id();

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[a-zA-ZÀ-ỹ0-9_.\-]+$/u',
                'not_regex:/@/',
                'unique:users,name,' . $userId,
            ],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                'unique:users,email,' . $userId,
            ],
            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
                new StrongPassword(),
            ],
            'password_confirmation' => ['required_with:password'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên không được để trống.',
            'name.regex' => 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới.',
            'name.not_regex' => 'Tên đăng nhập không được giống định dạng email.',
            'name.unique' => 'Tên đăng nhập đã tồn tại.',
            'email.required' => 'Email không được để trống.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã được sử dụng.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password_confirmation.required_with' => 'Vui lòng xác nhận lại mật khẩu.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $name = strtolower($this->input('name'));
            $email = strtolower($this->input('email'));
            if ($name && $email && $name === $email) {
                $validator->errors()->add('name', 'Tên đăng nhập không được giống email.');
            }
        });
    }
}