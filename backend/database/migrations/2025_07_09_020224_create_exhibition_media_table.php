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
        Schema::create('exhibition_media', function (Blueprint $table) {
            $table->id();

            $table->foreignId('exhibition_space_id')->constrained('exhibition_spaces')->cascadeOnDelete();

            $table->enum('type', ['image', 'panorama', 'video', 'vr_scene'])->default('image');
            $table->string('url');                  // đường dẫn ảnh hoặc video
            $table->string('caption')->nullable();  // mô tả ngắn
            $table->integer('order')->default(0);   // thứ tự hiển thị

            $table->json('metadata')->nullable();  // hotspot, toạ độ, v.v.
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exhibition_media');
    }
};