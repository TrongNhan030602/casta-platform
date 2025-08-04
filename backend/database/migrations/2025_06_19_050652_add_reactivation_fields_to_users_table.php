<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('reactivation_requested')->default(false)->after('status');
            $table->timestamp('reactivation_requested_at')->nullable()->after('reactivation_requested');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['reactivation_requested', 'reactivation_requested_at']);
        });
    }
};