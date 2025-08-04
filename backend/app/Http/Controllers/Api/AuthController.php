<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Services\AuthService;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Exceptions\Auth\LoginFailedException;
use App\Http\Resources\Auth\UserAuthResource;
use App\Http\Requests\AuthRequest\LoginRequest;
use App\Http\Requests\AuthRequest\RegisterRequest;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use App\Http\Requests\AuthRequest\ChangePasswordRequest;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->only('identifier', 'password');

            $user = $this->authService->login($credentials);

            // ✅ Load quan hệ trước khi tạo tokens hoặc resource
            switch ($user->role) {
                case 'dn':
                case 'nvdn':
                    $user->load('enterprise');
                    break;
                case 'kh':
                    $user->load('customer');
                    break;
            }

            $this->authService->logLogin($request, $user);

            $tokenResult = $this->authService->createTokens($user);

            return response()
                ->json([
                    'message' => 'Đăng nhập thành công',
                    ...$tokenResult['data'],
                    'user' => new UserAuthResource($user),
                ])
                ->withCookie($tokenResult['cookie']);

        } catch (LoginFailedException $e) {
            $status = match ($e->type) {
                'not_found', 'wrong_password' => 401,
                'not_verified', 'inactive' => 403,
                default => 400,
            };

            return response()->json([
                'message' => $e->getMessage(),
                'code' => strtoupper($e->type), // Ví dụ: WRONG_PASSWORD
            ], $status);
        } catch (\Exception $e) {
            Log::error('Đăng nhập thất bại: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi máy chủ'], 500);
        }
    }



    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');
        if (!$refreshToken) {
            return response()->json(['message' => 'Missing refresh token'], 401);
        }

        $user = $this->authService->getUserFromRefreshToken($refreshToken);
        if (!$user) {
            return response()->json(['message' => 'Invalid or expired token'], 401);
        }
        $this->authService->revokeRefreshToken($refreshToken);
        switch ($user->role) {
            case 'dn':
            case 'nvdn':
                $user->load('enterprise');
                break;
            case 'kh':
                $user->load('customer');
                break;
        }

        $tokenResult = $this->authService->createTokens($user);

        return response()
            ->json([
                ...$tokenResult['data'],
                'user' => new UserAuthResource($user),
            ])
            ->withCookie($tokenResult['cookie']);
    }

    public function logout(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');
        if ($refreshToken) {
            $this->authService->revokeRefreshToken($refreshToken);
        }

        // Xóa cookie
        cookie()->queue(
            cookie()->forget('refresh_token')
        );

        return response()->json(['message' => 'Đăng xuất thành công']);
    }
    public function me()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['message' => 'Người dùng chưa xác thực'], 401);
            }

            // 👉 Load các quan hệ cần thiết tùy theo role
            switch ($user->role) {
                case 'dn':
                case 'nvdn':
                    $user->load('enterprise');
                    break;

                case 'kh':
                    $user->load('customer');
                    break;
            }

            return response()->json(new UserAuthResource($user));

        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token đã hết hạn'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Token không hợp lệ'], 401);
        } catch (TokenBlacklistedException $e) {
            return response()->json(['message' => 'Token đã bị thu hồi'], 401);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token không tồn tại hoặc không thể xử lý'], 401);
        } catch (\Exception $e) {
            Log::error('Lỗi lấy thông tin người dùng: ' . $e->getMessage());
            return response()->json(['message' => 'Không thể lấy thông tin người dùng'], 500);
        }
    }

    public function registerCustomer(RegisterRequest $request)
    {
        try {
            $user = $this->authService->registerCustomer($request->validated());

            return response()->json([
                'message' => 'Đăng ký khách hàng thành công. Vui lòng xác thực email được gửi đến bạn',
                'user' => new UserAuthResource($user),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Đăng ký KH thất bại: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi máy chủ'], 500);
        }
    }

    public function registerEnterprise(RegisterRequest $request)
    {
        try {
            $user = $this->authService->registerEnterprise($request->validated());

            return response()->json([
                'message' => 'Đăng ký doanh nghiệp thành công. Vui lòng xác thực email và chờ phê duyệt hồ sơ.',
                'user' => new UserAuthResource($user),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Đăng ký DN thất bại: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi máy chủ'], 500);
        }
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $success = $this->authService->verifyEmail($request->token);

        if (!$success) {
            return response()->json(['message' => 'Token không hợp lệ hoặc đã xác thực.'], 400);
        }

        return response()->json(['message' => 'Xác thực email thành công.']);
    }
    public function resendVerificationEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $result = $this->authService->resendVerificationEmail($request->email);

        if (!$result) {
            return response()->json([
                'message' => 'Email không hợp lệ hoặc đã xác thực.',
            ], 400);
        }

        return response()->json([
            'message' => 'Đã gửi lại email xác thực.',
        ]);
    }








    public function changePassword(ChangePasswordRequest $request)
    {
        $user = Auth::user();

        $changed = $this->authService->changePassword(
            $user,
            $request->input('current_password'),
            $request->input('new_password')
        );

        if (!$changed) {
            return response()->json([
                'message' => 'Mật khẩu hiện tại không đúng.',
            ], 422);
        }

        return response()->json([
            'message' => 'Đổi mật khẩu thành công.',
        ]);
    }



}