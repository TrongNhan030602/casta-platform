<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->boolean('is_public')->default(false)->after('status');
            $table->string('public_slug')->nullable()->unique()->after('is_public');
        });
    }

    public function down(): void
    {
        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->dropColumn(['is_public', 'public_slug']);
        });
    }
};