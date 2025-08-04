<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('feedbacks', function (Blueprint $table) {
            $table->string('status')->default('new')->after('rating');  // enum string: new, reviewed, resolved
            $table->text('response')->nullable()->after('status');     // phản hồi từ DN hoặc CVQL
        });
    }

    public function down(): void
    {
        Schema::table('feedbacks', function (Blueprint $table) {
            $table->dropColumn(['status', 'response']);
        });
    }
};