<?php

namespace App\Http\Requests\ExhibitionSpace;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\ExhibitionSpaceStatus;
use App\Models\ExhibitionSpace;

class UpdateExhibitionSpaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Lấy model ExhibitionSpace từ route, fallback về ID nếu không phải instance
        $space = $this->route('exhibition_space');
        $spaceId = $space instanceof ExhibitionSpace ? $space->id : $space;

        return [
            'category_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:exhibition_space_categories,id',
            ],
            'name' => 'sometimes|required|string|max:255',

            'code' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('exhibition_spaces', 'code')->ignore($spaceId),
            ],

            'location' => 'sometimes|required|string|max:255',
            'zone' => 'nullable|string|max:100',
            'size' => 'nullable|string|max:100',
            'status' => ['sometimes', Rule::in(ExhibitionSpaceStatus::values())],
            'price' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'metadata' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập tên không gian.',
            'location.required' => 'Vui lòng nhập vị trí không gian.',
            'status.in' => 'Trạng thái không hợp lệ. Cho phép: available, booked, maintenance.',
            'price.numeric' => 'Giá phải là số.',
            'price.min' => 'Giá thuê không được âm.',
            'category_id.exists' => 'Danh mục không tồn tại.',
            'code.unique' => 'Mã không gian đã tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'tên không gian',
            'code' => 'mã không gian',
            'location' => 'vị trí',
            'status' => 'trạng thái',
            'price' => 'giá thuê',
            'category_id' => 'danh mục không gian',
        ];
    }
}