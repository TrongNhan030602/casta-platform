<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTaggablesTable extends Migration
{
    public function up()
    {
        Schema::create('taggables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tag_id')->constrained('tags')->cascadeOnDelete();
            $table->unsignedBigInteger('taggable_id');
            $table->string('taggable_type', 100);
            $table->timestamps();

            $table->unique(['tag_id', 'taggable_id', 'taggable_type'], 'taggables_unique');
            $table->index(['taggable_type', 'taggable_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('taggables');
    }
}