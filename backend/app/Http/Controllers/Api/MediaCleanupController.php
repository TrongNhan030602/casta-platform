<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;

class MediaCleanupController extends Controller
{
    public function run(Request $request)
    {
        $days = (int) $request->input('days', 1);

        // Gọi command
        Artisan::call('media:cleanup', [
            '--days' => $days
        ]);

        $output = Artisan::output();

        return response()->json([
            'message' => "Đã chạy dọn media rác.",
            'output' => $output,
        ]);
    }
}