<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->unsignedInteger('unit_price')->nullable()->after('end_date');
        });
    }

    public function down(): void
    {
        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->dropColumn('unit_price');
        });
    }
};