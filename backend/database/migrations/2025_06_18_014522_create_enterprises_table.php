<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\EnterpriseStatus;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('enterprises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->string('company_name');
            $table->string('tax_code')->unique();
            $table->string('business_field');
            $table->string('district')->nullable();
            $table->string('address')->nullable();
            $table->string('representative')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->unique();
            $table->string('website')->nullable();
            $table->string('logo_url')->nullable();
            $table->json('documents')->nullable();

            $table->string('status')->default(EnterpriseStatus::PENDING->value);
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enterprises');
    }
};