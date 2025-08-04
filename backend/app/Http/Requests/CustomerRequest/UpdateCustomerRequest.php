<?php

namespace App\Http\Requests\CustomerRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\Gender;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // có thể áp dụng policy nếu cần
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', Rule::in(Gender::values())],
            'dob' => ['nullable', 'date', 'before:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'Tên khách hàng phải là chuỗi.',
            'name.max' => 'Tên khách hàng không được vượt quá 255 ký tự.',

            'phone.string' => 'Số điện thoại phải là chuỗi.',
            'phone.max' => 'Số điện thoại không được vượt quá 20 ký tự.',

            'address.string' => 'Địa chỉ phải là chuỗi.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',


            'gender.in' => 'Giới tính không hợp lệ (male, female, other).',

            'dob.date' => 'Ngày sinh không hợp lệ.',
            'dob.before' => 'Ngày sinh phải nhỏ hơn ngày hiện tại.',
        ];
    }
}