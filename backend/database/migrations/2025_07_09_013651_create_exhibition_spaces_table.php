<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exhibition_spaces', function (Blueprint $table) {
            $table->id();

            $table->string('code')->unique();                 // Mã định danh không gian
            $table->string('name');                           // Tên gọi hiển thị
            $table->string('location');                       // Địa chỉ hoặc khu vực cụ thể
            $table->string('zone')->nullable();               // Khu vực (VD: "Tầng 2 - Khu A")
            $table->string('size')->nullable();               // VD: "4m x 5m"

            $table->enum('status', ['available', 'booked', 'maintenance'])->default('available');
            $table->decimal('price', 12, 2)->default(0);

            $table->json('images')->nullable();              // Ảnh thường
            $table->json('panorama_images')->nullable();     // Ảnh 360 độ
            $table->string('video_url')->nullable();         // Video giới thiệu
            $table->string('vr_link')->nullable();           // Link viewer 360

            $table->text('description')->nullable();         // Mô tả thêm
            $table->json('metadata')->nullable();            // JSON mở rộng: hotspot, toạ độ, dữ liệu ảo hoá

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exhibition_spaces');
    }
};