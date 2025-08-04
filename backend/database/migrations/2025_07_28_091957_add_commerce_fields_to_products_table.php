<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // 👇 Vị trí sau description
            $table->string('model_3d_url')->nullable()->after('description');
            $table->string('video_url')->nullable()->after('model_3d_url');
            $table->json('tags')->nullable()->after('video_url');

            // 👇 Sau price (giá khuyến mãi + thời gian)
            $table->decimal('discount_price', 15, 2)->nullable()->after('price');
            $table->timestamp('discount_start_at')->nullable()->after('discount_price');
            $table->timestamp('discount_end_at')->nullable()->after('discount_start_at');

            // 👇 Sau stock (vận chuyển)
            $table->decimal('weight', 10, 2)->nullable()->after('stock');
            $table->json('dimensions')->nullable()->after('weight');
            $table->string('shipping_type', 30)->default('calculated')->after('dimensions'); // dùng enum ShippingType

            // 👇 Sau shipping (thống kê)
            $table->unsignedInteger('views_count')->default(0)->after('shipping_type');
            $table->unsignedInteger('purchased_count')->default(0)->after('views_count');
            $table->unsignedInteger('reviews_count')->default(0)->after('purchased_count');
            $table->decimal('average_rating', 3, 1)->default(0)->after('reviews_count');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'model_3d_url',
                'video_url',
                'tags',
                'discount_price',
                'discount_start_at',
                'discount_end_at',
                'weight',
                'dimensions',
                'shipping_type',
                'views_count',
                'purchased_count',
                'reviews_count',
                'average_rating',
            ]);
        });
    }
};