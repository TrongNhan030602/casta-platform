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
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->enum('type', ['product', 'enterprise', 'space', 'service']);
            $table->unsignedBigInteger('target_id'); // ID của đối tượng được đánh giá

            $table->text('content')->nullable();
            $table->unsignedTinyInteger('rating')->default(5); // từ 1 đến 5

            $table->timestamps();

            // Index để tối ưu truy vấn theo đối tượng
            $table->index(['type', 'target_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};