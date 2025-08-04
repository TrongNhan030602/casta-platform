<?php // app/Exceptions/Auth/LoginFailedException.php
namespace App\Exceptions\Auth;

use Exception;

class LoginFailedException extends Exception
{
    public string $type;

    public function __construct(string $type, string $message = "Đăng nhập thất bại.")
    {
        parent::__construct($message);
        $this->type = $type;
    }
}