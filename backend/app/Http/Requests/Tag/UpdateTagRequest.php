<?php
namespace App\Http\Requests\Tag;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTagRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $tagId = $this->route('id');
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('tags', 'slug')->ignore($tagId)],
        ];
    }

    public function messages()
    {
        return [
            'name.string' => 'Tên tag phải là chuỗi ký tự.',
            'name.max' => 'Tên tag không được vượt quá :max ký tự.',
            'slug.string' => 'Slug phải là chuỗi ký tự.',
            'slug.max' => 'Slug không được vượt quá :max ký tự.',
            'slug.unique' => 'Slug đã tồn tại trong hệ thống.',
        ];
    }
}