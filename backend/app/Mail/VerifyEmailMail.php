<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyEmailMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;

    private const CENTER_NAME = 'Trung tâm Ứng dụng Tiến bộ Khoa học và Công nghệ (CASTA)';

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function build()
    {
        $url = config('app.frontend_url') . '/verify-email?token=' . $this->user->verification_token;

        $html = "
            <p>Xin chào {$this->user->name},</p>
            <p>Bạn vừa đăng ký tài khoản trên hệ thống do <strong>" . self::CENTER_NAME . "</strong> vận hành.</p>
            <p>Vui lòng nhấn vào liên kết dưới đây để xác thực email:</p>
            <p>
                <a href='{$url}' style='
                    display:inline-block;
                    padding:10px 15px;
                    background:#1d4ed8;
                    color:#fff;
                    text-decoration:none;
                    border-radius:5px;
                '>
                    Xác thực Email
                </a>
            </p>
            <p>Nếu bạn không đăng ký, hãy bỏ qua email này.</p>
            <p>Trân trọng,<br>" . self::CENTER_NAME . "</p>
        ";

        return $this->subject('Xác thực Email tài khoản - ' . self::CENTER_NAME)
            ->html($html);
    }
}