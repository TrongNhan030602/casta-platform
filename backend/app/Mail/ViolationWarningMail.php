<?php
namespace App\Mail;

use App\Models\User;
use App\Models\Violation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ViolationWarningMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public Violation $violation;

    private const CENTER_NAME = 'Trung tâm Ứng dụng Tiến bộ Khoa học và Công nghệ (CASTA)';

    public function __construct(User $user, Violation $violation)
    {
        $this->user = $user;
        $this->violation = $violation;
    }

    public function build()
    {
        $html = "
            <p>Xin chào {$this->user->name},</p>
            <p>Hệ thống do <strong>" . self::CENTER_NAME . "</strong> vận hành đã ghi nhận tài khoản của bạn có dấu hiệu vi phạm.</p>
            <p><strong>Lý do:</strong> {$this->violation->reason}</p>
        ";

        if ($this->violation->details) {
            $html .= "<p><strong>Chi tiết:</strong> {$this->violation->details}</p>";
        }

        $html .= "
            <p>Vui lòng rà soát lại hoạt động tài khoản và khắc phục ngay để tránh tình trạng tái phạm.</p>
            <p>Lưu ý: Tái phạm có thể dẫn đến <strong>tạm khóa hoặc vô hiệu hóa tài khoản</strong> theo quy định của hệ thống.</p>
            <p>Trân trọng,<br>" . self::CENTER_NAME . "</p>
        ";

        return $this->subject('Cảnh báo vi phạm tài khoản - ' . self::CENTER_NAME)
            ->html($html);
    }
}