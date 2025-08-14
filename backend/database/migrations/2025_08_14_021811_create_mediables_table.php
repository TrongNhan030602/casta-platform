<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('mediables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_id')->constrained()->onDelete('cascade');
            $table->morphs('mediable'); // mediable_id & mediable_type
            $table->string('role')->nullable(); // ví dụ: featured, gallery, banner,...
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mediables');
    }
};