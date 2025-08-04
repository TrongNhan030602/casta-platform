<?php
namespace App\Mail;

use App\Models\RentalContract;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RentalContractApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public RentalContract $contract;

    // Đặt tên đơn vị để tái sử dụng
    private const CENTER_NAME = 'Trung tâm Ứng dụng Tiến bộ Khoa học và Công nghệ (CASTA)';

    public function __construct(RentalContract $contract)
    {
        $this->contract = $contract;
    }

    public function build()
    {
        $enterpriseName = $this->contract->enterprise?->company_name ?? 'Doanh nghiệp không xác định';
        $spaceName = $this->contract->space?->name ?? 'Không gian không xác định';
        $start = $this->contract->start_date?->format('d/m/Y') ?? 'Không xác định';
        $end = $this->contract->end_date?->format('d/m/Y') ?? 'Không xác định';

        $html = "
            <h2>📄 Xác nhận phê duyệt hợp đồng thuê không gian</h2>
            <p>Kính gửi doanh nghiệp <strong>{$enterpriseName}</strong>,</p>
            <p>Yêu cầu thuê không gian <strong>{$spaceName}</strong> đã được hệ thống <strong>phê duyệt</strong>.</p>
            <p><strong>Thời gian sử dụng:</strong> {$start} đến {$end}</p>
            <p>Vui lòng chuẩn bị sản phẩm để trưng bày và tuân thủ các quy định của hệ thống.</p>
            <p>Trân trọng,<br>" . self::CENTER_NAME . "</p>
        ";

        return $this->subject("CASTA - Xác nhận phê duyệt thuê không gian")
            ->html($html);
    }
}