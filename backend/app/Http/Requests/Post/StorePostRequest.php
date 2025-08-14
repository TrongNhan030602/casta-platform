<?php
namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\PostType;
use App\Enums\PostStatus;

class StorePostRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Kiểm tra quyền controller
    }

    public function rules()
    {
        return [
            'type' => ['required', 'string', 'in:' . implode(',', PostType::values())],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug'],
            'category_id' => ['nullable', 'integer', 'exists:news_categories,id'],
            'summary' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['integer', 'exists:media,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:tags,id'],
            'status' => ['required', 'string', 'in:' . implode(',', PostStatus::values())],
            'is_sticky' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'author_id' => ['nullable', 'integer', 'exists:users,id'],
            'event_location' => ['nullable', 'string', 'max:255'],
            'event_start' => ['nullable', 'date'],
            'event_end' => ['nullable', 'date', 'after_or_equal:event_start'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
        ];
    }

    public function messages()
    {
        return [
            'type.required' => 'Loại bài viết là bắt buộc.',
            'type.in' => 'Loại bài viết không hợp lệ.',
            'title.required' => 'Tiêu đề là bắt buộc.',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự.',
            'slug.unique' => 'Slug đã tồn tại, vui lòng chọn slug khác.',
            'category_id.exists' => 'Danh mục không tồn tại.',
            'gallery.array' => 'Gallery phải là mảng.',
            'gallery.*.integer' => 'Các phần tử trong gallery phải là số nguyên.',
            'gallery.*.exists' => 'Một hoặc nhiều ảnh trong gallery không tồn tại.',
            'tags.array' => 'Tags phải là mảng.',
            'tags.*.integer' => 'Mỗi tag phải là số nguyên.',
            'tags.*.exists' => 'Một hoặc nhiều tag không tồn tại.',
            'status.required' => 'Trạng thái bài viết là bắt buộc.',
            'status.in' => 'Trạng thái bài viết không hợp lệ.',
            'is_sticky.boolean' => 'Giá trị ghim bài không hợp lệ.',
            'published_at.date' => 'Ngày xuất bản không hợp lệ.',
            'author_id.exists' => 'Tác giả không tồn tại.',
            'event_location.max' => 'Địa điểm sự kiện không được vượt quá 255 ký tự.',
            'event_start.date' => 'Ngày bắt đầu sự kiện không hợp lệ.',
            'event_end.date' => 'Ngày kết thúc sự kiện không hợp lệ.',
            'event_end.after_or_equal' => 'Ngày kết thúc sự kiện phải sau hoặc bằng ngày bắt đầu.',
            'meta_title.max' => 'Meta tiêu đề không được vượt quá 255 ký tự.',
        ];
    }


}