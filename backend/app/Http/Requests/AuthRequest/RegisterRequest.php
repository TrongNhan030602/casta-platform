<?php
namespace App\Http\Requests\AuthRequest;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\StrongPassword;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[a-zA-ZÀ-ỹ0-9_.\-]+$/u',
                'unique:users,name',
                'not_regex:/@/',
            ],
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                new StrongPassword(),
            ],
            'password_confirmation' => ['required'],

        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới.',
            'name.unique' => 'Tên đăng nhập đã tồn tại.',
            'name.not_regex' => 'Tên đăng nhập không được giống định dạng email.',
            'email.unique' => 'Email đã được sử dụng.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
        ];
    }
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (strtolower($this->input('name')) === strtolower($this->input('email'))) {
                $validator->errors()->add('name', 'Tên đăng nhập không được giống email.');
            }
        });
    }

}