<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exhibition_space_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('exhibition_space_categories')->nullOnDelete();
            $table->timestamps();
        });

        Schema::table('exhibition_spaces', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('id')->constrained('exhibition_space_categories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('exhibition_spaces', function (Blueprint $table) {
            $table->dropConstrainedForeignId('category_id');
        });

        Schema::dropIfExists('exhibition_space_categories');
    }
};