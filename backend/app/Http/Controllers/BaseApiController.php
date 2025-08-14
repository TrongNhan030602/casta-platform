<?php
// app/Http/Controllers/BaseApiController.php
namespace App\Http\Controllers;

use Throwable;
use RuntimeException;
use Illuminate\Http\JsonResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class BaseApiController extends Controller
{
    protected function safe(callable $callback): JsonResponse
    {
        try {
            return $callback();
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện thao tác này.',
                'hint' => config('app.debug') ? $e->getMessage() : null,
            ], 403);
        } catch (ValidationException $e) {
            // Trả về chi tiết lỗi để FE hiển thị
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $e->errors(),
            ], 422);
        } catch (ModelNotFoundException $e) {
            $model = class_basename($e->getModel());
            $translated = [
                'RentalContract' => 'hợp đồng thuê',
                'ExhibitionSpace' => 'không gian triển lãm',
                'Enterprise' => 'doanh nghiệp',
            ];
            $message = $translated[$model] ?? $model;
            return response()->json(['message' => ucfirst($message) . ' không tồn tại.'], 404);
        } catch (HttpException $e) {
            // Đã rõ status + message => trả trực tiếp
            return response()->json(['message' => $e->getMessage()], $e->getStatusCode());
        } catch (NotFoundHttpException $e) {
            return response()->json(['message' => 'Không tìm thấy tài nguyên yêu cầu.'], 404);
        } catch (RuntimeException $e) {
            // Lỗi nghiệp vụ -> Conflict
            return response()->json([
                'message' => $e->getMessage()
            ], 409);
        } catch (Throwable $e) {
            // Log lỗi để điều tra (không leak thông tin ở prod)
            Log::error('Unhandled exception', [
                'message' => $e->getMessage(),
                'exception' => $e,
            ]);

            return response()->json([
                'message' => 'Đã xảy ra lỗi hệ thống.',
                'error' => config('app.debug') ? $e->getMessage() : null,
                'trace' => config('app.debug') ? $e->getTrace() : null,
            ], 500);
        }
    }

    protected function meta($paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
        ];
    }
}