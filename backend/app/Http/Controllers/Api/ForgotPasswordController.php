<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\ForgotPasswordService;
use App\Http\Requests\AuthRequest\ResetPasswordRequest;
use App\Http\Requests\AuthRequest\ForgotPasswordRequest;

class ForgotPasswordController extends Controller
{
    protected ForgotPasswordService $service;

    public function __construct(ForgotPasswordService $service)
    {
        $this->service = $service;
    }

    public function sendResetLink(ForgotPasswordRequest $request): JsonResponse
    {
        $success = $this->service->sendResetLink($request->email);

        return $success
            ? response()->json(['message' => 'Đã gửi email đặt lại mật khẩu.'])
            : response()->json(['message' => 'Không gửi được email.'], 400);
    }

    public function reset(ResetPasswordRequest $request): JsonResponse
    {
        $ok = $this->service->resetPassword($request->validated());

        return $ok
            ? response()->json(['message' => 'Đổi mật khẩu thành công.'])
            : response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 422);
    }

}