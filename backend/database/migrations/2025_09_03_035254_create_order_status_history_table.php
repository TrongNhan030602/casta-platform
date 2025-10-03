<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('order_status_history', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('sub_order_id')->nullable()->constrained('sub_orders');
            $table->enum('status', [
                'pending',
                'confirmed',
                'shipped',
                'delivered',
                'cancelled',
                'partially_delivered',
                'completed',
                'refunded'
            ]);
            $table->text('note')->nullable();
            $table->foreignId('changed_by')->constrained('users');
            $table->timestamp('created_at')->useCurrent();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_status_history');
    }
};