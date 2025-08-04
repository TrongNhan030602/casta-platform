<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rental_contracts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('enterprise_id')->constrained('enterprises')->cascadeOnDelete();
            $table->foreignId('exhibition_space_id')->constrained('exhibition_spaces')->cascadeOnDelete();

            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('total_cost', 12, 2)->default(0);

            $table->enum('status', ['pending', 'approved', 'cancelled', 'expired'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->text('cancel_reason')->nullable();
            $table->timestamp('extend_requested_at')->nullable(); // Nếu DN yêu cầu gia hạn

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rental_contracts');
    }
};