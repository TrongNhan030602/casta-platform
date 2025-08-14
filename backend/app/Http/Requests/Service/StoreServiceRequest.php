<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ServiceStatus;

class StoreServiceRequest extends FormRequest
{
    public function authorize()
    {
        // Quyền tạo service, kiểm tra ở controller sẽ chuẩn hơn
        return true;
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:services,slug'],
            'category_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'summary' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['integer', 'exists:media,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:tags,id'],
            'status' => ['nullable', 'string', 'in:' . implode(',', ServiceStatus::values())],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên dịch vụ là bắt buộc.',
            'name.max' => 'Tên dịch vụ không được vượt quá 255 ký tự.',
            'slug.unique' => 'Slug đã tồn tại, vui lòng sử dụng slug khác.',
            'category_id.exists' => 'Danh mục dịch vụ không hợp lệ.',
            'price.numeric' => 'Giá dịch vụ phải là số.',
            'duration_minutes.integer' => 'Thời lượng phải là số nguyên.',
            'status.in' => 'Trạng thái dịch vụ không hợp lệ.',
        ];
    }
}