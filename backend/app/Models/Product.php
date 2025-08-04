<?php

namespace App\Models;

use App\Enums\ProductTag;
use App\Enums\FeedbackType;
use App\Enums\ShippingType;
use App\Enums\ProductStatus;
use App\Enums\FeedbackStatus;
use App\Enums\ProductStockLogType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'products';

    protected $fillable = [
        'enterprise_id', // Doanh nghiệp sở hữu sản phẩm
        'category_id',   // Danh mục sản phẩm
        'name',          // Tên sản phẩm
        'description',   // Mô tả chi tiết
        'price',         // Giá gốc
        'stock',         // 🟡 Tồn kho hiện tại (số lượng sản phẩm có sẵn)

        'status',            // Trạng thái kiểm duyệt (pending, published, rejected)
        'reason_rejected',   // Lý do bị từ chối (nếu có)
        'approved_by',       // ID người duyệt
        'approved_at',       // Thời điểm được duyệt

        // ✅ Thuộc tính thương mại hóa (bổ sung tính năng nâng cao cho sản phẩm)
        'discount_price',      // 🔻 Giá khuyến mãi (nếu có)
        'discount_start_at',   // Bắt đầu áp dụng giảm giá
        'discount_end_at',     // Kết thúc giảm giá

        'weight',         // ⚖️ Khối lượng (đơn vị tùy theo hệ thống)
        'dimensions',     // 📦 Kích thước đóng gói (VD: {width, height, depth} dạng JSON)
        'shipping_type',  // 📬 Hình thức vận chuyển (enum: fixed, calculated, pickup)

        'views_count',     // 👀 Số lượt xem sản phẩm
        'purchased_count', // 🛒 Tổng số lượt đã mua
        'reviews_count',   // ⭐ Tổng số đánh giá
        'average_rating',  // 🌟 Điểm trung bình đánh giá (VD: 4.3)

        'model_3d_url',    // 🧱 Link mô hình 3D nếu có
        'video_url',       // 🎬 Video giới thiệu sản phẩm
        'tags',            // 🏷️ mới, hot 
    ];


    protected $casts = [
        'status' => ProductStatus::class,
        'approved_at' => 'datetime',
        'price' => 'decimal:2',
        'stock' => 'integer',

        // ✅ Cast bổ sung
        'discount_price' => 'decimal:2',
        'discount_start_at' => 'datetime',
        'discount_end_at' => 'datetime',
        'weight' => 'decimal:2',
        'dimensions' => 'array',
        'shipping_type' => ShippingType::class,
        'views_count' => 'integer',
        'purchased_count' => 'integer',
        'reviews_count' => 'integer',
        'average_rating' => 'decimal:1',
        'tags' => 'array',
    ];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (is_null($product->stock)) {
                $product->stock = 0;
            }
        });
    }
    public function getTagEnumsAttribute(): array
    {
        return collect($this->tags)
            ->map(fn($tag) => ProductTag::tryFrom($tag)) // Chuyển thành enum (nếu hợp lệ)
            ->filter() // Bỏ null nếu không match enum
            ->values() // Reset index
            ->all(); // Trả về mảng thường
    }

    // -------------------- RELATIONS --------------------
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function spaceProducts(): HasMany
    {
        return $this->hasMany(ExhibitionSpaceProduct::class);
    }



    public function stockLogs(): HasMany
    {
        return $this->hasMany(ProductStockLog::class);
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(Feedback::class, 'target_id')
            ->where('type', FeedbackType::PRODUCT)
            ->whereIn('status', [
                FeedbackStatus::REVIEWED,
                FeedbackStatus::RESOLVED,
            ]);
    }



    /**
     * Cập nhật lại tồn kho dựa trên các log nhập/xuất
     */
    public function recalculateStock(): void
    {
        $import = $this->stockLogs()
            ->whereIn('type', ProductStockLogType::casesFor(fn($type) => $type->isImport()))
            ->sum('quantity');

        $export = $this->stockLogs()
            ->whereIn('type', ProductStockLogType::casesFor(fn($type) => $type->isExport()))
            ->sum('quantity');

        $this->stock = max(0, $import - $export);
        $this->save();
    }

    public function updateRatingStats(): void
    {
        $query = $this->feedbacks();

        $avg = $query->avg('rating');
        $this->reviews_count = $query->count();
        $this->average_rating = is_null($avg) ? null : round($avg, 1);

        $this->save();
    }

    public function increaseViews(): void
    {
        $key = 'product_viewed_' . $this->id . '_' . request()->ip();
        if (!cache()->has($key)) {
            $this->increment('views_count');
            cache()->put($key, true, now()->addMinutes(10)); // Chống spam trong 10 phút
        }
    }


}