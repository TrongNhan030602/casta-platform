<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\UserRole;
use App\Enums\UserStatus;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', UserRole::values())->default(UserRole::KH->value);
            $table->enum('status', UserStatus::values())->default(UserStatus::ACTIVE->value);
            $table->rememberToken()->nullable();
            $table->string('verification_token')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('verification_token_expires_at')->nullable();
            $table->boolean('reactivation_requested')->default(false);
            $table->timestamp('reactivation_requested_at')->nullable();
            $table->unsignedBigInteger('enterprise_id')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};