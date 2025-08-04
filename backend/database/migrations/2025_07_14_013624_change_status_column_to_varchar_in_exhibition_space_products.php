<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeStatusColumnToVarcharInExhibitionSpaceProducts extends Migration
{
    public function up(): void
    {
        Schema::table('exhibition_space_products', function (Blueprint $table) {
            $table->string('status', 50)->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('exhibition_space_products', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected', 'removed'])->default('pending')->change();
        });
    }
}