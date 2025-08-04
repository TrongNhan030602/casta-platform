<?php use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Xoá foreign key trên user_id
        Schema::table('refresh_tokens', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        // Xoá index kết hợp
        DB::statement('ALTER TABLE refresh_tokens DROP INDEX refresh_tokens_user_id_token_hash_unique');

        // Tạo lại foreign key riêng
        Schema::table('refresh_tokens', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Tạo lại unique đơn trên token_hash
        Schema::table('refresh_tokens', function (Blueprint $table) {
            $table->unique('token_hash');
        });
    }

    public function down(): void
    {
        // Xoá unique mới
        Schema::table('refresh_tokens', function (Blueprint $table) {
            $table->dropUnique(['token_hash']);
        });

        // Xoá foreign key cũ
        Schema::table('refresh_tokens', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        // Tạo lại index kết hợp cũ
        DB::statement('ALTER TABLE refresh_tokens ADD UNIQUE refresh_tokens_user_id_token_hash_unique (user_id, token_hash)');

        // Tạo lại foreign key
        Schema::table('refresh_tokens', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};