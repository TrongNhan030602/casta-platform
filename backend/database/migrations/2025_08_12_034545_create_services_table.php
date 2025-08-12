<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServicesTable extends Migration
{
    public function up()
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('slug', 255)->unique();
            $table->foreignId('category_id')->nullable()->constrained('service_categories')->nullOnDelete();
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->decimal('price', 14, 2)->nullable();
            $table->string('currency', 3)->default('VND');
            $table->integer('duration_minutes')->nullable();
            $table->json('features')->nullable();
            $table->unsignedBigInteger('featured_media_id')->nullable()->index();
            $table->json('gallery')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['category_id', 'status']);
            $table->fullText(['name', 'summary', 'content']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('services');
    }
}