<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['news', 'event'])->default('news'); // phân biệt
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->foreignId('category_id')->nullable()->constrained('news_categories')->nullOnDelete();
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->unsignedBigInteger('featured_media_id')->nullable()->index();
            $table->json('gallery')->nullable(); // array of media ids / urls
            $table->string('tags_cached', 512)->nullable(); // denormalized
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->boolean('is_sticky')->default(false);
            $table->dateTime('published_at')->nullable();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            // event-specific optional fields
            $table->string('event_location')->nullable();
            $table->dateTime('event_start')->nullable();
            $table->dateTime('event_end')->nullable();

            $table->string('meta_title', 255)->nullable();
            $table->string('meta_description', 500)->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['type', 'status', 'published_at']);
            // Fulltext (MySQL): title, summary, content
            $table->fullText(['title', 'summary', 'content']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('posts');
    }
}