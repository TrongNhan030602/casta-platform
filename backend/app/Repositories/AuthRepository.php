<?php
namespace App\Repositories;

use Carbon\Carbon;
use App\Models\User;
use App\Enums\UserRole;
use App\Models\Customer;
use App\Enums\UserStatus;
use App\Mail\WelcomeMail;
use App\Models\Enterprise;
use Illuminate\Support\Str;
use App\Models\RefreshToken;
use App\Mail\VerifyEmailMail;
use App\Enums\EnterpriseStatus;
use App\Interfaces\AuthInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Exceptions\Auth\LoginFailedException;

class AuthRepository implements AuthInterface
{

    public function login(string $identifier, string $password): User
    {
        $user = User::whereRaw('BINARY email = ?', [$identifier])
            ->orWhereRaw('BINARY name = ?', [$identifier])
            ->first();

        if (!$user) {
            throw new LoginFailedException('not_found', 'Không tìm thấy tài khoản.');
        }

        if (!Hash::check($password, $user->password)) {
            throw new LoginFailedException('wrong_password', 'Mật khẩu không đúng.');
        }

        if (is_null($user->email_verified_at)) {
            throw new LoginFailedException('not_verified', 'Tài khoản chưa xác thực email.');
        }

        if ($user->status !== UserStatus::ACTIVE) {
            throw new LoginFailedException('inactive', 'Tài khoản đã bị khóa.');
        }

        return $user;
    }

    public function generateRefreshToken($user): string
    {
        $maxTokens = config('jwt.max_refresh_tokens', 5);

        // Tạo token mới
        $plainToken = Str::random(64);
        $hashedToken = hash('sha256', $plainToken);

        // Lưu vào DB trước
        $newToken = RefreshToken::create([
            'user_id' => $user->id,
            'token_hash' => $hashedToken,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'expires_at' => now()->addDays(7),
            'revoked' => false,
        ]);

        // Xoá token cũ nếu vượt quá giới hạn
        $tokens = RefreshToken::where('user_id', $user->id)
            ->orderByDesc('created_at') // từ mới nhất -> cũ nhất
            ->get();

        if ($tokens->count() > $maxTokens) {
            $tokensToDelete = $tokens->slice($maxTokens); // Bỏ qua N token mới nhất
            $tokenIds = $tokensToDelete->pluck('id');

            RefreshToken::whereIn('id', $tokenIds)->delete();
        }

        return $plainToken;
    }




    public function validateRefreshToken(string $plainToken): ?User
    {
        $token = trim($plainToken);
        $hashed = hash('sha256', $plainToken);

        $record = RefreshToken::where('token_hash', $hashed)
            ->where('revoked', false)
            ->where('expires_at', '>', now())
            ->first();

        return $record?->user;
    }

    public function revokeRefreshToken(string $token): bool
    {
        $token = trim($token);
        $hashed = hash('sha256', $token);

        $updated = RefreshToken::where('token_hash', $hashed)->update([
            'revoked' => true,
            'revoked_at' => now()
        ]);


        return $updated > 0;
    }
    public function registerCustomer(array $data): User
    {
        $user = User::create([
            'name' => trim($data['name']),
            'email' => trim($data['email']),
            'password' => Hash::make($data['password']),
            'status' => UserStatus::PENDING,
            'role' => UserRole::KH,
            'verification_token' => Str::uuid(),
            'verification_token_expires_at' => now()->addHours(12),
        ]);

        \Mail::to($user->email)->send(new VerifyEmailMail($user));

        return $user;
    }

    public function registerEnterprise(array $data): User
    {
        $user = User::create([
            'name' => trim($data['name']),
            'email' => trim($data['email']),
            'password' => Hash::make($data['password']),
            'status' => UserStatus::PENDING,
            'role' => UserRole::DN,
            'verification_token' => Str::uuid(),
            'verification_token_expires_at' => now()->addHours(12),
        ]);

        \Mail::to($user->email)->send(new VerifyEmailMail($user));

        return $user;
    }

    public function verifyEmail(string $token): bool
    {
        $user = User::where('verification_token', $token)->first();

        if (!$user)
            return false;

        // ✅ Kiểm tra token còn hạn
        if (!$user->verification_token_expires_at || now()->greaterThan($user->verification_token_expires_at)) {
            return false;
        }

        $user->email_verified_at = now();
        $user->status = UserStatus::ACTIVE;
        $user->verification_token = null;
        $user->verification_token_expires_at = null;
        $user->save();

        if ($user->role === UserRole::DN && !$user->enterprise) {
            Enterprise::create([
                'user_id' => $user->id,
                'status' => EnterpriseStatus::PENDING,
            ]);
        }

        if ($user->role === UserRole::KH && !$user->customer) {
            Customer::create([
                'user_id' => $user->id,
            ]);
        }

        // ✅ Gửi email chào mừng
        Mail::to($user->email)->send(new WelcomeMail($user));

        return true;
    }

    public function resendVerificationEmail(string $email): bool
    {
        $user = User::where('email', $email)->first();

        if (!$user || $user->isEmailVerified()) {
            return false;
        }

        $user->verification_token = Str::uuid();
        $user->verification_token_expires_at = now()->addHours(12);
        $user->save();

        Mail::to($user->email)->send(new VerifyEmailMail($user));

        return true;
    }





    public function changePassword($user, string $currentPassword, string $newPassword): bool
    {
        if (!\Hash::check($currentPassword, $user->password)) {
            return false;
        }

        $user->password = \Hash::make($newPassword);
        $user->save();

        return true;
    }




}