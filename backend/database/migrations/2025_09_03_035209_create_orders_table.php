<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('customer_id')->constrained('customers');
            $table->decimal('total_amount', 12, 2);
            $table->decimal('shipping_fee_total', 12, 2)->default(0);
            $table->enum('status', ['pending', 'partially_delivered', 'completed', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['unpaid', 'paid', 'pending', 'refunded'])->default('unpaid');
            $table->enum('payment_method', ['bank_transfer', 'cod', 'online'])->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};