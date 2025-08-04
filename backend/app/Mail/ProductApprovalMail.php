<?php

namespace App\Mail;

use App\Models\Product;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class ProductApprovalMail extends Mailable
{
    use Queueable, SerializesModels;

    public Product $product;

    private const CENTER_NAME = 'Trung tâm Ứng dụng Tiến bộ Khoa học và Công nghệ';
    private const CENTER_SHORT = 'CASTA';

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function build()
    {
        $product = $this->product;
        $enterprise = $product->enterprise;
        $companyName = $enterprise?->company_name ?? 'Quý doanh nghiệp';

        $status = $product->status->value;
        $subject = self::CENTER_SHORT . " - Trạng thái sản phẩm \"{$product->name}\"";

        $html = match ($status) {
            'published' => "
                <p>Kính gửi <strong>{$companyName}</strong>,</p>
                <p>Sản phẩm <strong>{$product->name}</strong> đã được 
                    <strong style=\"color: green\">phê duyệt</strong> và hiện đang hiển thị công khai trên sàn giao dịch 
                    do " . self::CENTER_NAME . " (" . self::CENTER_SHORT . ") vận hành.</p>
                <p>Trân trọng,<br>
                " . self::CENTER_NAME . " (" . self::CENTER_SHORT . ")</p>
            ",

            'rejected' => "
                <p>Kính gửi <strong>{$companyName}</strong>,</p>
                <p>Sản phẩm <strong>{$product->name}</strong> đã bị 
                    <strong style=\"color: red\">từ chối</strong> trong quá trình xét duyệt.</p>
                <p><strong>Lý do:</strong> {$product->reason_rejected}</p>
                <p>Vui lòng chỉnh sửa lại nội dung sản phẩm và gửi xét duyệt lại để được xem xét.</p>
                <p>Trân trọng,<br>
                " . self::CENTER_NAME . " (" . self::CENTER_SHORT . ")</p>
            ",

            default => "
                <p>Thông tin trạng thái sản phẩm không hợp lệ.</p>
            ",
        };

        return $this->subject($subject)->html($html);
    }
}