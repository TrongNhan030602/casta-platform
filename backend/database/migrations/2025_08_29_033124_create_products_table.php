<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->foreignId('enterprise_id')->constrained('enterprises')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();

            // Thông tin cơ bản
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->integer('stock')->default(0);

            // Trạng thái sản phẩm
            $table->enum('status', ['draft', 'pending', 'published', 'rejected', 'disabled'])->default('pending');
            $table->string('reason_rejected')->nullable();

            // Thông tin duyệt sản phẩm
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();

            // Thông tin giảm giá
            $table->decimal('discount_price', 12, 2)->nullable();
            $table->timestamp('discount_start_at')->nullable();
            $table->timestamp('discount_end_at')->nullable();

            // Thông tin vận chuyển & khối lượng
            $table->decimal('weight', 8, 2)->nullable();
            $table->json('dimensions')->nullable(); // {width, height, depth}
            $table->enum('shipping_type', ['fixed', 'calculated', 'pickup'])->nullable();

            // Thống kê
            $table->integer('views_count')->default(0);
            $table->integer('purchased_count')->default(0);
            $table->integer('reviews_count')->default(0);
            $table->decimal('average_rating', 3, 1)->nullable();

            // Media & tags
            $table->string('model_3d_url')->nullable();
            $table->string('video_url')->nullable();
            $table->json('tags')->nullable(); // array các tag: hot, new, sale, limited

            $table->json('images')->nullable(); // Lưu nhiều ảnh chính

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};