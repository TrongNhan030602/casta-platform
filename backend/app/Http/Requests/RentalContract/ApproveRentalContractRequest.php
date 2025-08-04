<?php
namespace App\Http\Requests\RentalContract;

use Illuminate\Foundation\Http\FormRequest;

class ApproveRentalContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // kiểm tra quyền trong controller
    }

    public function rules(): array
    {
        return []; // không cần dữ liệu từ user
    }
}