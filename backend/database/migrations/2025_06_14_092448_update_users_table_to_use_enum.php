<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\UserRole;
use App\Enums\UserStatus;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', UserRole::values())->default(UserRole::KH->value)->change();
            $table->enum('status', UserStatus::values())->default(UserStatus::ACTIVE->value)->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'admin',
                'cvcc',
                'cvql',
                'qlgh',
                'dn',
                'nvdn',
                'kh',
                'cskh',
                'kt',
                'qlnd',
                'ktq'
            ])->default('kh')->change();
            $table->enum('status', ['active', 'inactive'])->default('active')->change();
        });
    }
};