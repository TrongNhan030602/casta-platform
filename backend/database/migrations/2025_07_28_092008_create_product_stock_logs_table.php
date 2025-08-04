<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_stock_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained()
                ->cascadeOnDelete(); // FK đến bảng products

            $table->enum('type', ['import', 'sale', 'return', 'adjust']);
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2)->nullable(); // có thể null nếu không cần tính giá
            $table->text('note')->nullable();

            $table->timestamps(); // tạo cả created_at và updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_stock_logs');
    }
};