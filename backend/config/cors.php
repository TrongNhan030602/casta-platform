<?php return [

    'paths' => ['api/*', 'auth/*', 'sanctum/csrf-cookie'],


    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('APP_FRONTEND_URL', 'http://localhost:5173'), // Ví dụ khi dev
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // ⚠️ Bắt buộc để gửi cookie

];