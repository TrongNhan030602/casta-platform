<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductStockSummaryTable extends Migration
{
    public function up()
    {
        Schema::create('product_stock_summary', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->unique()->comment('ID sản phẩm');
            $table->integer('stock')->default(0)->comment('Tồn kho hiện tại');
            $table->decimal('average_cost', 15, 2)->default(0)->comment('Giá vốn trung bình');
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_stock_summary');
    }
}