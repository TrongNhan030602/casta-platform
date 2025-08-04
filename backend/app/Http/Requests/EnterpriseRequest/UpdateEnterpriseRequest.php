<?php

namespace App\Http\Requests\EnterpriseRequest;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEnterpriseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['sometimes', 'string', 'max:255'],
            'tax_code' => ['sometimes', 'nullable', 'string', 'max:100'],
            'business_field' => ['sometimes', 'nullable', 'string'],
            'district' => ['sometimes', 'nullable', 'string', 'max:100'],
            'address' => ['sometimes', 'nullable', 'string'],
            'representative' => ['sometimes', 'nullable', 'string', 'max:100'],
            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
                'regex:/^(\+84|0)[1-9][0-9]{8,9}$/'
            ],
            'email' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                'email:rfc,dns'
            ],
            'website' => ['sometimes', 'nullable', 'url', 'max:255'],
            'logo_url' => ['sometimes', 'nullable', 'url', 'max:255'],

        ];
    }

    public function messages(): array
    {
        return [
            'company_name.string' => 'Tên doanh nghiệp phải là chuỗi ký tự.',
            'company_name.max' => 'Tên doanh nghiệp không được vượt quá :max ký tự.',

            'tax_code.string' => 'Mã số thuế phải là chuỗi ký tự.',
            'tax_code.max' => 'Mã số thuế không được vượt quá :max ký tự.',

            'business_field.string' => 'Lĩnh vực kinh doanh phải là chuỗi ký tự.',

            'district.string' => 'Quận/Huyện phải là chuỗi ký tự.',
            'district.max' => 'Quận/Huyện không được vượt quá :max ký tự.',

            'address.string' => 'Địa chỉ phải là chuỗi ký tự.',

            'representative.string' => 'Người đại diện phải là chuỗi ký tự.',
            'representative.max' => 'Người đại diện không được vượt quá :max ký tự.',

            'phone.string' => 'Số điện thoại phải là chuỗi ký tự.',
            'phone.max' => 'Số điện thoại không được vượt quá :max ký tự.',
            'phone.regex' => 'Số điện thoại không đúng định dạng. Vui lòng nhập số bắt đầu bằng 0 hoặc +84 và gồm 10-11 chữ số.',

            'email.string' => 'Email phải là chuỗi ký tự.',
            'email.max' => 'Email không được vượt quá :max ký tự.',
            'email.email' => 'Email không đúng định dạng hoặc không tồn tại domain.',

            'website.url' => 'Website phải đúng định dạng URL.',
            'website.max' => 'Website không được vượt quá :max ký tự.',

            'logo_url.url' => 'Logo phải đúng định dạng URL.',
            'logo_url.max' => 'Logo không được vượt quá :max ký tự.',

        ];
    }
}