<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;

    private const CENTER_NAME = 'Trung tâm Ứng dụng Tiến bộ Khoa học và Công nghệ (CASTA)';
    private const SUPPORT_EMAIL = 'trungtamungdung@cantho.gov.vn';

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function build()
    {
        $html = "
            <p>Xin chào {$this->user->name},</p>
            <p>Chào mừng bạn đến với nền tảng do <strong>" . self::CENTER_NAME . "</strong> vận hành!</p>
            <p>Tài khoản của bạn đã được xác thực thành công. Bạn có thể đăng nhập và bắt đầu sử dụng các chức năng được phân quyền trong hệ thống.</p>
            <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ qua email: <a href='mailto:" . self::SUPPORT_EMAIL . "'>" . self::SUPPORT_EMAIL . "</a>.</p>
            <p>Trân trọng,<br>" . self::CENTER_NAME . "</p>
        ";

        return $this->subject('Chào mừng bạn đến với ' . self::CENTER_NAME)
            ->html($html);
    }
}