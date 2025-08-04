<?php

namespace App\Http\Requests\Feedback;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\FeedbackType;

class StoreFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // đã check qua policy controller
    }

    public function rules(): array
    {
        return [
            'type' => 'required|in:' . implode(',', FeedbackType::values()),
            'target_id' => 'required|integer|min:1',
            'content' => 'required|string|max:1000',
            'rating' => 'nullable|integer|min:1|max:5',
        ];
    }
}