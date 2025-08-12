<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMediaTable extends Migration
{
    public function up()
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('disk', 50)->default('local'); // local | s3 | etc
            $table->string('path', 191); // giảm từ 1024 xuống 191 ký tự
            $table->string('url', 1024)->nullable();
            $table->string('mime', 100)->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->json('meta')->nullable(); // width, height, alt, caption
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['disk', 'path']); // index trên 2 cột nhưng path chỉ 191 ký tự nên hợp lệ
        });
    }

    public function down()
    {
        Schema::dropIfExists('media');
    }
}