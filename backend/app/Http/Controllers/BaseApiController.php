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
    /**
     * Bao bọc logic controller để handle exception chuẩn
     */
    protected function safe(callable $callback): JsonResponse
    {
        try {
            return $callback();
        } catch (AuthorizationException $e) {
            return $this->forbidden($e->getMessage());
        } catch (ValidationException $e) {
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
                'Order' => 'đơn hàng',
                'SubOrder' => 'đơn hàng con',
                'OrderItem' => 'sản phẩm trong đơn',
                'Transaction' => 'giao dịch',
                'Customer' => 'khách hàng',
            ];
            $message = $translated[$model] ?? $model;
            return $this->notFound(ucfirst($message) . ' không tồn tại.');
        } catch (HttpException $e) {
            return response()->json(['message' => $e->getMessage()], $e->getStatusCode());
        } catch (NotFoundHttpException $e) {
            return $this->notFound('Không tìm thấy tài nguyên yêu cầu.');
        } catch (RuntimeException $e) {
            return $this->conflict($e->getMessage());
        } catch (Throwable $e) {
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

    /**
     * Trả về 404
     */
    protected function notFound(string $message = 'Resource not found'): JsonResponse
    {
        return response()->json([
            'message' => $message,
        ], 404);
    }

    /**
     * Trả về 403
     */
    protected function forbidden(string $message = 'Bạn không có quyền truy cập.'): JsonResponse
    {
        return response()->json([
            'message' => $message,
        ], 403);
    }



    /**
     * Trả về 409 conflict
     */
    protected function conflict(string $message = 'Conflict occurred'): JsonResponse
    {
        return response()->json([
            'message' => $message,
        ], 409);
    }

    /**
     * Trả về meta cho pagination
     */
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