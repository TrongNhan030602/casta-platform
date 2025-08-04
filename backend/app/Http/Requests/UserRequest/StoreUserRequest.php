<?php

namespace App\Http\Requests\UserRequest;

use App\Enums\UserRole;
use App\Rules\StrongPassword;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // sẽ kiểm tra policy trong Controller
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
                new StrongPassword(),
            ],
            'role' => 'required|in:' . implode(',', UserRole::values()),
            'enterprise_id' => [
                'nullable',
                'exists:enterprises,id',
                Rule::requiredIf(fn() => UserRole::tryFrom($this->role)?->value === UserRole::NVDN->value),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập tên đăng nhập.',
            'name.string' => 'Tên đăng nhập phải là chuỗi.',
            'name.min' => 'Tên đăng nhập phải có ít nhất 3 ký tự.',
            'name.max' => 'Tên đăng nhập không vượt quá 50 ký tự.',
            'name.regex' => 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới.',
            'name.unique' => 'Tên đăng nhập đã tồn tại.',
            'name.not_regex' => 'Tên đăng nhập không được giống định dạng email.',

            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email đã được sử dụng.',

            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.string' => 'Mật khẩu không hợp lệ.',

            'role.required' => 'Vui lòng chọn vai trò người dùng.',
            'role.in' => 'Vai trò không hợp lệ.',

            'enterprise_id.required' => 'Vui lòng chọn doanh nghiệp nếu bạn chọn vai trò Nhân viên doanh nghiệp.',
            'enterprise_id.exists' => 'Doanh nghiệp được chọn không tồn tại.',
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