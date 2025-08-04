<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


use Illuminate\Support\Facades\Mail;

Route::get('/test-mail', function () {
    Mail::raw('Xin chào! Đây là email test gửi từ Laravel qua hộp thư casta@design24.edu.vn.', function ($message) {
        $message->to('ntnhan030602@gmail.com')->subject('✅ Test gửi mail thành công từ Laravel');
    });

    return '✅ Đã gửi email. Kiểm tra hộp thư nhé!';
});