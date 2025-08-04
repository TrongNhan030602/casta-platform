<?php
namespace App\Services;

use App\Interfaces\ForgotPasswordInterface;

class ForgotPasswordService
{
    protected ForgotPasswordInterface $repo;

    public function __construct(ForgotPasswordInterface $repo)
    {
        $this->repo = $repo;
    }

    public function sendResetLink(string $email): bool
    {
        return $this->repo->sendResetLink($email);
    }

    public function resetPassword(array $credentials): bool
    {
        return $this->repo->resetPassword($credentials);
    }

}