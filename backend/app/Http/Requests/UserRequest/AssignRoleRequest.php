<?php

namespace App\Http\Requests\UserRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\UserRole;

class AssignRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Kiểm tra bằng policy trong controller
    }

    public function rules(): array
    {
        return [
            'role' => [
                'required',
                Rule::in(UserRole::systemRolesValues()),
            ],
        ];
    }
}