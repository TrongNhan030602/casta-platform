<?php // app/Http/Controllers/BaseApiController.php
namespace App\Http\Controllers;

use Throwable;
use Illuminate\Http\JsonResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use Symfony\Component\HttpKernel\Exception\HttpException;
class BaseApiController extends Controller
{
    /**
     * Gói gọn try-catch cho các action controller.
     *
     * @param  callable  $callback
     * @return JsonResponse
     */

    protected function safe(callable $callback): JsonResponse
    {
        try {
            return $callback();
        } catch (AuthorizationException $e) {


            return response()->json([
                'message' => 'Bạn không có quyền thực hiện thao tác này.',
                'hint' => config('app.debug') ? $e->getMessage() : null,
            ], 403);
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
            // ✅ Luôn đặt trước NotFoundHttpException
            return response()->json(['message' => $e->getMessage()], $e->getStatusCode());
        } catch (NotFoundHttpException $e) {
            return response()->json(['message' => 'Không tìm thấy tài nguyên yêu cầu.'], 404);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi hệ thống.',
                'error' => config('app.debug') ? $e->getMessage() : null,
                'trace' => config('app.debug') ? $e->getTrace() : null,
            ], 500);
        }
    }

    // Phân trang
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