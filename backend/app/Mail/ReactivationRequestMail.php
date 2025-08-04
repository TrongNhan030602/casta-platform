<?php
namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReactivationRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function build()
    {
        $formattedDate = optional($this->user->reactivation_requested_at)?->format('d/m/Y H:i');

        return $this->subject('Yêu cầu mở khóa tài khoản từ người dùng')
            ->html("
                <h2>🔒 Yêu cầu mở khóa tài khoản</h2>
                <p><strong>Tên người dùng:</strong> {$this->user->name}</p>
                <p><strong>Email:</strong> {$this->user->email}</p>
                <p><strong>Vai trò:</strong> {$this->user->role->value}</p>
                <p><strong>Thời gian yêu cầu:</strong> {$formattedDate}</p>
                <p>Vui lòng đăng nhập hệ thống để xử lý yêu cầu này.</p>
            ");
    }
}