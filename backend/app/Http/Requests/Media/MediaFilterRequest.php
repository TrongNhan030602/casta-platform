<?php
namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class MediaFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Chuyển đổi giá trị query param trước khi validate
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'with_trashed' => filter_var($this->with_trashed, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            'only_trashed' => filter_var($this->only_trashed, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
        ]);
    }

    public function rules(): array
    {
        return [
            'uploader_id' => 'nullable|integer|exists:users,id',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
            'mime' => 'nullable|string',
            'disk' => 'nullable|string',
            'q' => 'nullable|string|max:255',
            'sort_by' => 'nullable|in:id,created_at,size,mime',
            'sort_order' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
            'with_trashed' => 'nullable|boolean',
            'only_trashed' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'uploader_id.integer' => 'ID người tải lên phải là số.',
            'uploader_id.exists' => 'Người tải lên không tồn tại.',
            'date_from.date' => 'Ngày bắt đầu không hợp lệ.',
            'date_to.date' => 'Ngày kết thúc không hợp lệ.',
            'q.max' => 'Từ khóa tìm kiếm không được dài quá 255 ký tự.',
            'sort_by.in' => 'Trường sắp xếp không hợp lệ.',
            'sort_order.in' => 'Thứ tự sắp xếp phải là "asc" hoặc "desc".',
            'per_page.integer' => 'Số lượng hiển thị phải là số.',
            'per_page.min' => 'Số lượng hiển thị tối thiểu là 1.',
            'per_page.max' => 'Số lượng hiển thị tối đa là 100.',
            'with_trashed.boolean' => 'Giá trị with_trashed phải là boolean.',
            'only_trashed.boolean' => 'Giá trị only_trashed phải là boolean.',
        ];
    }

    public function filters(): array
    {
        return [
            'uploader_id' => $this->input('uploader_id'),
            'date_from' => $this->input('date_from'),
            'date_to' => $this->input('date_to'),
            'mime' => $this->input('mime'),
            'disk' => $this->input('disk'),
            'q' => $this->input('q'),
            'sort_by' => $this->input('sort_by'),
            'sort_order' => $this->input('sort_order'),
            'per_page' => $this->input('per_page', 15),
            'with_trashed' => $this->input('with_trashed', false),
            'only_trashed' => $this->input('only_trashed', false),
        ];
    }
}