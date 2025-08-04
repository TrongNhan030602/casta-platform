<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('product_stock_logs', function (Blueprint $table) {
            $table->boolean('affect_cost')->default(true)->after('unit_price');
        });
    }

    public function down(): void
    {
        Schema::table('product_stock_logs', function (Blueprint $table) {
            $table->dropColumn('affect_cost');
        });
    }
};