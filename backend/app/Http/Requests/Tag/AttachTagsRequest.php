<?php
namespace App\Http\Requests\Tag;

use Illuminate\Foundation\Http\FormRequest;

class AttachTagsRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'tags' => ['required', 'array'],
            'tags.*' => ['integer', 'exists:tags,id'],
        ];
    }

    public function messages()
    {
        return [
            'tags.required' => 'Danh sách tag là bắt buộc.',
            'tags.array' => 'Danh sách tag phải là một mảng.',
            'tags.*.integer' => 'Mỗi tag ID phải là số nguyên.',
            'tags.*.exists' => 'Tag ID :input không tồn tại trong hệ thống.',
        ];
    }
}