<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('product_stock_logs', function (Blueprint $table) {
            $table->integer('stock_after')->nullable()->after('note');
            $table->decimal('avg_cost_after', 20, 2)->nullable()->after('stock_after');
        });
    }

    public function down(): void
    {
        Schema::table('product_stock_logs', function (Blueprint $table) {
            $table->dropColumn(['stock_after', 'avg_cost_after']);
        });
    }
};