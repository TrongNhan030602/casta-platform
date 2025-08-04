<?php use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('exhibition_spaces', function (Blueprint $table) {
            $table->dropColumn([
                'images',
                'panorama_images',
                'video_url',
                'vr_link',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('exhibition_spaces', function (Blueprint $table) {
            $table->json('images')->nullable();
            $table->json('panorama_images')->nullable();
            $table->string('video_url')->nullable();
            $table->string('vr_link')->nullable();
        });
    }
};