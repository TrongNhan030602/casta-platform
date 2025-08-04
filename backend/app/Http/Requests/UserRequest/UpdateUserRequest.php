<?php

namespace App\Http\Requests\UserRequest;

use App\Enums\UserRole;
use App\Rules\StrongPassword;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // kiểm tra policy ở Controller
    }

    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[a-zA-ZÀ-ỹ0-9_.\-]+$/u',
                'not_regex:/@/',
                'unique:users,name,' . $this->user->id,
            ],
            'email' => [
                'sometimes',
                'required',
                'email',
                'unique:users,email,' . $this->user->id,
            ],

            // Mật khẩu chỉ validate khi được gửi lên
            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
                new StrongPassword(),
            ],
            'password_confirmation' => ['nullable'],

            // Role: chỉ validate nếu có gửi từ FE (sắp tới có API riêng thì càng đúng)
            'role' => [
                'sometimes',
                'in:' . implode(',', UserRole::values()),
            ],

            // Nếu role là nhân viên doanh nghiệp thì bắt buộc có enterprise_id
            'enterprise_id' => [
                'nullable',
                'exists:enterprises,id',
                Rule::requiredIf(function () {
                    $role = UserRole::tryFrom(
                        $this->input('role', $this->user->role->value)
                    );
                    return $role === UserRole::NVDN;
                }),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới.',
            'name.not_regex' => 'Tên đăng nhập không được giống định dạng email.',
            'name.unique' => 'Tên đăng nhập đã tồn tại.',
            'email.unique' => 'Email đã được sử dụng.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password_confirmation.required_with' => 'Vui lòng xác nhận lại mật khẩu.',
            'enterprise_id.required' => 'Vui lòng chọn doanh nghiệp nếu gán vai trò nhân viên doanh nghiệp.',
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

    protected function prepareForValidation()
    {
        // Nếu FE gửi password là chuỗi rỗng, xem như không có
        if ($this->input('password') === '') {
            $this->merge([
                'password' => null,
                'password_confirmation' => null,
            ]);
        }

        // Nếu FE gửi role là chuỗi rỗng (ẩn khỏi form), bỏ luôn
        if ($this->input('role') === '') {
            $this->merge([
                'role' => null,
            ]);
        }
    }
}