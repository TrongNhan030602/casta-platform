<?php
namespace App\Interfaces;

use App\Models\User;

interface AuthInterface
{
    public function registerCustomer(array $data): User;
    public function registerEnterprise(array $data): User;

    public function login(string $email, string $password);

    public function generateRefreshToken($user);
    public function validateRefreshToken(string $token);
    public function revokeRefreshToken(string $token);
    public function changePassword($user, string $currentPassword, string $newPassword): bool;

    public function verifyEmail(string $token): bool;
    public function resendVerificationEmail(string $email): bool;



}