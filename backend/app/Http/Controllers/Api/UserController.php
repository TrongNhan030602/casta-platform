<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\User\UserResource;
use App\Http\Resources\User\LoginLogResource;
use Illuminate\Auth\Access\AuthorizationException;
use App\Http\Requests\UserRequest\IndexUserRequest;
use App\Http\Requests\UserRequest\StoreUserRequest;
use App\Http\Requests\UserRequest\AssignRoleRequest;
use App\Http\Requests\UserRequest\UpdateUserRequest;
use App\Http\Requests\UserRequest\UpdateProfileRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\UserRequest\ReviewEnterpriseRequest;
use App\Http\Requests\UserRequest\UpdateUserStatusRequest;

class UserController extends Controller
{
    use AuthorizesRequests;

    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    public function index(IndexUserRequest $request): JsonResponse
    {
        if (Gate::denies('viewAny', User::class)) {
            throw new AuthorizationException('Bạn không có quyền xem danh sách người dùng.');
        }

        $filters = $request->only([
            'role',
            'status',
            'keyword',
            'sort_by',
            'sort_order' // 👈 thêm đây
        ]);

        $perPage = $request->validated('per_page') ?? 15;

        $users = $this->userService->getAllUsers($filters, $perPage);

        return response()->json([
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }

        if (Gate::denies('view', $user)) {
            throw new AuthorizationException('Bạn không có quyền xem người dùng này.');
        }

        return response()->json(new UserResource($user));
    }



    public function store(StoreUserRequest $request): JsonResponse
    {
        // ✅ Check quyền bằng policy
        if (Gate::denies('create', User::class)) {
            throw new AuthorizationException('Bạn không có quyền tạo tài khoản.');
        }

        $data = $request->only(['name', 'email', 'password', 'role', 'enterprise_id',]);

        // ✅ Không cho tạo tài khoản với quyền cao hơn mình
        $currentUser = auth()->user();
        if (
            $currentUser->role === UserRole::CVCC &&
            in_array($data['role'], [UserRole::ADMIN, UserRole::CVCC])
        ) {
            return response()->json(['message' => 'Không được tạo tài khoản có quyền ngang hoặc cao hơn.'], 403);
        }

        $user = $this->userService->createUser($data);

        return response()->json([
            'message' => 'Tạo tài khoản thành công.',
            'user' => new UserResource($user),

        ], 201);
    }
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        // ✅ Kiểm tra quyền chỉnh sửa user
        if (Gate::denies('update', $user)) {
            throw new AuthorizationException('Bạn không có quyền cập nhật tài khoản này.');
        }

        $data = $request->validated();

        // ✅ Nếu có đổi role
        if (isset($data['role']) && $data['role'] !== $user->role->value) {
            // Không cho DN → NVDN
            if ($user->role === UserRole::DN && $data['role'] === UserRole::NVDN->value) {
                return response()->json([
                    'message' => 'Không được phép chuyển doanh nghiệp thành nhân viên doanh nghiệp.',
                ], 422);
            }

            // Kiểm tra quyền đổi role qua policy
            if (Gate::denies('changeRole', [$user, $data['role']])) {
                return response()->json([
                    'message' => 'Bạn không có quyền thay đổi vai trò người dùng này.',
                ], 403);
            }
        }

        // ✅ Tiến hành cập nhật
        $updatedUser = $this->userService->updateUser($user, $data);

        return response()->json([
            'message' => 'Cập nhật người dùng thành công.',
            'user' => new UserResource($updatedUser),
        ]);
    }

    public function assignRole(AssignRoleRequest $request, User $user): JsonResponse
    {
        $newRole = $request->validated('role');

        // Không cho gán role cho KH, DN, NVDN
        if (!UserRole::isSystem($user->role)) {
            return response()->json([
                'message' => 'Chỉ được phân quyền cho nhóm tài khoản thuộc hệ thống quản trị.',
            ], 403);
        }

        // Kiểm tra quyền đổi role qua policy
        if (Gate::denies('changeRole', [$user, $newRole])) {
            throw new AuthorizationException('Bạn không có quyền phân quyền tài khoản này.');
        }

        $user->role = $newRole;
        $user->save();

        return response()->json([
            'message' => 'Phân quyền thành công.',
            'user' => new UserResource($user),
        ]);
    }

    public function toggleStatus(UpdateUserStatusRequest $request, User $user): JsonResponse
    {
        // ✅ Kiểm tra quyền từ Policy
        if (Gate::denies('updateStatus', $user)) {
            throw new AuthorizationException('Bạn không có quyền cập nhật trạng thái người dùng này.');
        }

        $status = UserStatus::from($request->validated('status'));

        $updatedUser = $this->userService->updateUserStatus($user, $status);

        return response()->json([
            'message' => 'Cập nhật trạng thái tài khoản thành công.',
            'user' => new UserResource($updatedUser),

        ]);
    }
    public function reviewEnterprise(ReviewEnterpriseRequest $request, User $user): JsonResponse
    {
        // ✅ Kiểm tra quyền bằng Gate hoặc Policy
        if (Gate::denies('review', $user)) {
            throw new AuthorizationException('Bạn không có quyền xét duyệt doanh nghiệp này.');
        }

        $status = UserStatus::from($request->validated('status'));

        // ✅ Kiểm tra status hợp lệ (chỉ duyệt hoặc từ chối)
        if (!in_array($status, [UserStatus::ACTIVE, UserStatus::REJECTED])) {
            return response()->json(['message' => 'Trạng thái không hợp lệ.'], 422);
        }

        try {
            // ✅ Gọi Service để xử lý tất cả logic
            $updatedUser = $this->userService->reviewEnterprise($user, $status);

            return response()->json([
                'message' => $status === UserStatus::ACTIVE
                    ? 'Doanh nghiệp đã được duyệt, hồ sơ đang chờ hoàn thiện.'
                    : 'Doanh nghiệp đã bị từ chối.',
                'user' => new UserResource($updatedUser),
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi duyệt doanh nghiệp.',
                'error' => config('app.debug') ? $e->getMessage() : 'Vui lòng thử lại sau.',
            ], 500);
        }
    }



    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = auth()->user();

        // Không cho sửa người khác bằng API này
        if (!$user) {
            throw new AuthorizationException('Không xác định được người dùng.');
        }

        $data = $request->validated();

        $updatedUser = $this->userService->updateProfile($user, $data);

        return response()->json([
            'message' => 'Cập nhật thông tin cá nhân thành công.',
            'user' => new UserResource($updatedUser),

        ]);
    }

    public function getLoginLogs(Request $request, User $user): JsonResponse
    {
        // ✅ Kiểm tra quyền bằng Policy
        if (Gate::denies('viewLoginLogs', $user)) {
            throw new AuthorizationException('Không đủ quyền.');
        }
        $perPage = (int) $request->query('per_page', 15);
        $logs = $this->userService->getLoginLogs($user, $perPage);

        // ✅ Trả về dữ liệu qua Resource
        return response()->json(LoginLogResource::collection($logs));
    }

    public function deleteLoginLog(int $logId): JsonResponse
    {
        $log = \App\Models\LoginLog::with('user')->find($logId);

        if (!$log || !$log->user) {
            return response()->json([
                'message' => 'Không tìm thấy log hoặc người dùng liên quan.',
            ], 404);
        }

        // ✅ Check quyền thông qua LoginLogPolicy@delete
        if (Gate::denies('delete', $log)) {
            throw new AuthorizationException('Bạn không có quyền xoá log đăng nhập này.');
        }

        $deleted = $this->userService->deleteLoginLog($logId);

        if (!$deleted) {
            return response()->json(['message' => 'Xoá thất bại.'], 500);
        }

        return response()->json(['message' => 'Xoá log đăng nhập thành công.']);
    }





    public function requestReactivation(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
        ]);

        $result = $this->userService->handleReactivationRequest(
            $request->identifier,
            $request->password
        );

        return response()->json($result['data'], $result['status']);
    }
    // Kiểm tra dữ liệu liên quan trước xóa
    public function checkDelete(User $user)
    {
        $warnings = $this->userService->checkRelatedDataBeforeDelete($user->id);

        if (!empty($warnings)) {
            return response()->json([
                'can_delete' => false,
                'warnings' => $warnings,
            ]);
        }

        return response()->json([
            'can_delete' => true,
            'warnings' => [],
        ]);
    }

    // Xóa tài khoản (sau khi QTHT xác nhận)
    public function destroy(User $user, Request $request)
    {


        // Phân quyền xóa
        $this->authorize('delete', $user);

        $force = $request->boolean('force'); // default = false

        // Nếu chưa force và có dữ liệu liên quan → cảnh báo
        if (!$force) {
            $warnings = $this->userService->checkRelatedDataBeforeDelete($user->id);

            if (!empty($warnings)) {
                return response()->json([
                    'message' => 'Tài khoản có dữ liệu quan trọng. Cần xác nhận xóa bằng force=true.',
                    'warnings' => $warnings,
                ], 400);
            }
        }

        if ($this->userService->deleteUser($user)) {
            return response()->json([
                'message' => 'Xóa tài khoản thành công.',
            ]);
        }

        return response()->json([
            'message' => 'Xóa tài khoản thất bại, vui lòng thử lại.',
        ], 500);
    }


}