<?php
namespace App\Http\Requests\Tag;

use Illuminate\Foundation\Http\FormRequest;

class StoreTagRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:tags,slug']
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên tag là bắt buộc.',
            'name.string' => 'Tên tag phải là chuỗi ký tự.',
            'name.max' => 'Tên tag không được vượt quá :max ký tự.',
            'slug.string' => 'Slug phải là chuỗi ký tự.',
            'slug.max' => 'Slug không được vượt quá :max ký tự.',
            'slug.unique' => 'Slug đã tồn tại trong hệ thống.',
        ];
    }
}