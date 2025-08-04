<?php

namespace App\Http\Requests\ExhibitionSpace;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\ExhibitionSpaceStatus;

class StoreExhibitionSpaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => [
                'nullable',
                'integer',
                'exists:exhibition_space_categories,id',
            ],
            'code' => 'required|string|unique:exhibition_spaces,code',
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'zone' => 'nullable|string|max:100',
            'size' => 'nullable|string|max:100',
            'status' => ['required', Rule::in(ExhibitionSpaceStatus::values())],
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'metadata' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Vui lòng nhập mã không gian.',
            'code.unique' => 'Mã không gian đã tồn tại.',
            'name.required' => 'Vui lòng nhập tên không gian.',
            'location.required' => 'Vui lòng nhập vị trí không gian.',
            'status.required' => 'Vui lòng chọn trạng thái không gian.',
            'status.in' => 'Trạng thái không hợp lệ. Giá trị cho phép: available, booked, maintenance.',
            'price.required' => 'Vui lòng nhập giá thuê.',
            'price.numeric' => 'Giá phải là số.',
            'price.min' => 'Giá thuê không được âm.',
            'category_id.exists' => 'Danh mục không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'code' => 'mã không gian',
            'name' => 'tên không gian',
            'location' => 'vị trí',
            'status' => 'trạng thái',
            'price' => 'giá thuê',
            'category_id' => 'danh mục không gian',
        ];
    }
}