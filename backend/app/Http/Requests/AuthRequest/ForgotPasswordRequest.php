<?php
namespace App\Http\Requests\AuthRequest;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['email' => 'required|email|exists:users,email'];
    }

    public function messages(): array
    {
        return ['email.exists' => 'Email không tồn tại trong hệ thống.'];
    }
}