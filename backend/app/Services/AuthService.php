<?php
namespace App\Services;

use App\Models\User;
use App\Models\LoginLog;
use Illuminate\Http\Request;
use App\Interfaces\AuthInterface;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class AuthService
{
    protected AuthInterface $authRepository;
    public function __construct(AuthInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function login(array $credentials): User
    {
        return $this->authRepository->login($credentials['identifier'], $credentials['password']);
    }



    public function createTokens(User $user): array
    {
        $accessToken = JWTAuth::fromUser($user);
        $refreshToken = $this->authRepository->generateRefreshToken($user);

        return [
            'data' => [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'expires_in' => auth()->factory()->getTTL() * 60,
                'user' => $user,
            ],
            'cookie' => cookie(
                name: 'refresh_token',
                value: $refreshToken,
                minutes: 60 * 24 * 7,
                path: '/',
                domain: config('session.domain'),
                secure: config('session.secure_cookie', false),
                httpOnly: true,
                raw: false,
                sameSite: 'Strict'
            ),
        ];
    }

    public function revokeRefreshToken(string $token): bool
    {
        $result = $this->authRepository->revokeRefreshToken($token);

        if (!$result) {
            Log::warning('Không tìm thấy refresh token cần thu hồi.', ['token' => $token]);
        }

        return $result;
    }
    public function registerCustomer(array $data): User
    {
        return $this->authRepository->registerCustomer($data);
    }
    public function verifyEmail(string $token): bool
    {
        return $this->authRepository->verifyEmail($token);
    }

    public function registerEnterprise(array $data): User
    {
        return $this->authRepository->registerEnterprise($data);
    }

    public function resendVerificationEmail(string $email): bool
    {
        return $this->authRepository->resendVerificationEmail($email);
    }



    public function logLogin(Request $request, User $user): void
    {
        try {
            $log = LoginLog::create([
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

        } catch (\Exception $e) {
            Log::error('Lỗi ghi log đăng nhập', ['error' => $e->getMessage()]);
        }
    }


    public function getUserFromRefreshToken(string $token): ?User
    {
        return $this->authRepository->validateRefreshToken($token);
    }


    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        return $this->authRepository->changePassword($user, $currentPassword, $newPassword);
    }

}