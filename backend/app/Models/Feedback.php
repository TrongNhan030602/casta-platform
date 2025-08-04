<?php

namespace App\Models;

use App\Models\Enterprise;
use App\Models\Product;
use App\Models\ExhibitionSpace;
use App\Enums\FeedbackType;
use App\Enums\FeedbackStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';

    protected $fillable = [
        'user_id',
        'type',
        'target_id',
        'content',
        'rating',
        'status',
        'response',
    ];

    protected $casts = [
        'type' => FeedbackType::class,
        'status' => FeedbackStatus::class,
    ];

    // ===== Quan hệ cơ bản =====
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'target_id');
    }

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(Enterprise::class, 'target_id');
    }

    public function space(): BelongsTo
    {
        return $this->belongsTo(ExhibitionSpace::class, 'target_id');
    }

    // ===== Getter động: target ảo =====
    public function getTargetAttribute(): ?Model
    {
        return match ($this->type) {
            FeedbackType::PRODUCT => $this->product,
            FeedbackType::ENTERPRISE => $this->enterprise,
            FeedbackType::SPACE => $this->space,
            default => null,
        };
    }

    // ===== Optional: nếu không dùng eager-load mà cần truy vấn cứng =====
    public function resolveTarget(): ?Model
    {
        return match ($this->type) {
            FeedbackType::PRODUCT => Product::find($this->target_id),
            FeedbackType::ENTERPRISE => Enterprise::find($this->target_id),
            FeedbackType::SPACE => ExhibitionSpace::find($this->target_id),
            default => null,
        };
    }
}