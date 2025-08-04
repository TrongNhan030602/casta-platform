<?php
namespace App\Http\Requests\ExhibitionSpaceProduct;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExhibitionSpaceProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // đã authorize trong controller
    }

    public function rules(): array
    {
        return [
            'note' => ['nullable', 'string', 'max:1000'],
            'position_metadata' => ['nullable', 'array'],
        ];
    }
}