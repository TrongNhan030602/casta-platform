<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Violation;
use Illuminate\Http\Request;
use App\Services\ViolationService;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\Violation\ViolationResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ViolationController extends Controller
{
    use AuthorizesRequests;

    protected ViolationService $violationService;

    public function __construct(ViolationService $violationService)
    {
        $this->violationService = $violationService;
    }

    public function warn(Request $request, $id)
    {
        try {
            // ⚠️ Lấy user trước để dùng trong authorize
            $user = User::findOrFail($id);

            // ✅ Truyền đủ 2 tham số vào policy
            $this->authorize('warn', [Violation::class, $user]);

            $request->validate([
                'reason' => 'required|string|max:255',
                'details' => 'nullable|string|max:1000',
            ]);

            // ✅ Kiểm tra trước khi tạo
            $count = $this->violationService->countViolationsByUser($user->id);
            if ($count >= 3) {
                return response()->json([
                    'message' => 'Tài khoản đã có 3 cảnh báo. Không thể gửi thêm.',
                ], 429); // Too Many Requests
            }

            // Tạo mới cảnh báo
            $violation = $this->violationService->warnUser(
                $user,
                $request->reason,
                $request->details
            );

            return response()->json([
                'message' => 'Đã gửi cảnh báo vi phạm',
                'violation' => $violation,
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Không tìm thấy người dùng để cảnh báo.',
            ], 404);
        } catch (\Throwable $e) {
            Log::error('[CẢNH BÁO] Lỗi khi gửi cảnh báo: ' . $e->getMessage());
            return response()->json([
                'message' => 'Lỗi khi gửi cảnh báo vi phạm. Vui lòng thử lại sau.',
            ], 500);
        }
    }




    public function index(Request $request)
    {
        try {
            $filters = $request->only([
                'keyword',
                'sort_by',
                'sort_order',
            ]);
            $perPage = (int) $request->input('per_page', 15);

            $paginator = $this->violationService->listViolations($filters, $perPage);

            return response()->json([
                'data' => ViolationResource::collection($paginator->items()),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
            ]);
        } catch (\Throwable $e) {
            \Log::error('[LỖI LẤY DS CẢNH BÁO] ' . $e->getMessage());
            return response()->json([
                'message' => 'Không thể tải danh sách cảnh báo',
            ], 500);
        }
    }




    public function getByUser($id)
    {
        return response()->json(
            $this->violationService->getUserViolations($id)
        );
    }

    public function myViolations(Request $request)
    {
        return response()->json(
            $this->violationService->getUserViolations($request->user()->id)
        );
    }
    public function destroy($id)
    {
        try {
            $violation = Violation::findOrFail($id);
            $targetUser = $violation->user;

            // ✅ Truyền đúng 2 tham số theo policy
            $this->authorize('delete', [Violation::class, $targetUser]);

            $success = $this->violationService->deleteViolation($id);

            if (!$success) {
                return response()->json(['message' => 'Không tìm thấy hoặc xóa thất bại'], 404);
            }

            return response()->json(['message' => 'Đã xóa cảnh báo']);

        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy cảnh báo'], 404);
        } catch (\Throwable $e) {
            \Log::error('[XÓA CẢNH BÁO] ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi khi xóa cảnh báo'], 500);
        }
    }


}