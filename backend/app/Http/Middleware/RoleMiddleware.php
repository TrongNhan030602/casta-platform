<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Nếu role là enum (BackedEnum), lấy giá trị string để so sánh
        $userRole = $user->role instanceof \BackedEnum ? $user->role->value : $user->role;

        // Kiểm tra nếu role của user nằm trong danh sách roles hợp lệ
        if (!in_array($userRole, $roles)) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}