<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class StrongPassword implements Rule
{
    public function passes($attribute, $value): bool
    {
        return preg_match('/[A-Z]/', $value) &&     // Có chữ hoa
            preg_match('/[a-z]/', $value) &&     // Có chữ thường
            preg_match('/[0-9]/', $value) &&     // Có số
            preg_match('/[@$!%*#?&]/', $value);  // Có ký tự đặc biệt
    }

    public function message(): string
    {
        return 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.';
    }
}