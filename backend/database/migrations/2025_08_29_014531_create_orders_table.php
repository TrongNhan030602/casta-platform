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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->decimal('total_price', 15, 2);
            $table->decimal('discount', 15, 2)->nullable();
            $table->decimal('final_price', 15, 2);
            $table->enum('status', ['pending', 'processing', 'shipping', 'completed', 'cancelled', 'returned'])->default('pending');
            $table->enum('payment_method', ['cod', 'bank_transfer', 'momo', 'zalopay'])->default('cod');
            $table->enum('payment_status', ['unpaid', 'paid', 'refunded'])->default('unpaid');
            $table->text('shipping_address');
            $table->string('shipping_phone', 20);
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes(); // 👈 bật soft delete
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};