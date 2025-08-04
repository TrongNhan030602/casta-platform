<?php
namespace App\Interfaces;

interface ForgotPasswordInterface
{
    public function sendResetLink(string $email): bool;
    public function resetPassword(array $credentials): bool;

}