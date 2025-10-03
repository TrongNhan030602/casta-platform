<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\ViolationController;
use App\Http\Controllers\Api\EnterpriseController;
use App\Http\Controllers\Api\MediaCleanupController;
use App\Http\Controllers\Api\NewsCategoryController;
use App\Http\Controllers\Api\ProductImageController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\RentalContractController;
use App\Http\Controllers\Api\ExhibitionMediaController;
use App\Http\Controllers\Api\ExhibitionSpaceController;
use App\Http\Controllers\Api\ServiceCategoryController;
use App\Http\Controllers\Api\ProductStockSummaryController;
use App\Http\Controllers\Api\Public\PublicCategoryController;
use App\Http\Controllers\Api\ExhibitionSpaceProductController;
use App\Http\Controllers\Api\ExhibitionSpaceCategoryController;
use App\Http\Controllers\Api\Public\PublicExhibitionController;

/** Truy cập ảnh từ Hostinger */
Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path("app/public/" . $path);

    if (!File::exists($filePath)) {
        abort(404, 'File not found.');
    }

    $file = File::get($filePath);
    $mimeType = File::mimeType($filePath);

    return response($file, 200)->header('Content-Type', $mimeType);
})->where('path', '.*');

// Clean media
Route::post('/media/cleanup', [MediaCleanupController::class, 'run'])->middleware('role:admin,cvcc');




//======================================= PUBLIC =========================================
Route::prefix('public')->group(function () {
    // Tree danh mục sản phẩm
    Route::get('/categories/tree', [PublicCategoryController::class, 'tree']);

    // Không gian trưng bày công khai theo slug
    Route::prefix('exhibitions')->group(function () {
        Route::get('{slug}', [PublicExhibitionController::class, 'show']);
    });
});



// ============================== Xác thực ========================================================
Route::prefix('auth')
    ->group(function () {
        // Không cần xác thực
        Route::post('/register/customer', [AuthController::class, 'registerCustomer']);
        Route::post('/register/enterprise', [AuthController::class, 'registerEnterprise']);
        // Xác thực email
        Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
        Route::post('/resend-verification', [AuthController::class, 'resendVerificationEmail']);

        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');
        // Đã lưu trong cookie
        Route::post('refresh', [AuthController::class, 'refresh']);
        // Quên pass
        Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
        Route::post('reset-password', [ForgotPasswordController::class, 'reset']);
        // Gửi yêu cầu mở khóa tài khoản
        Route::post('/request-reactivation', [UserController::class, 'requestReactivation']);
        // Cần xác thực (middleware JWT)
        Route::middleware(['auth:api'])->group(function () {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('logout', [AuthController::class, 'logout']);
            Route::post('change-password', [AuthController::class, 'changePassword']);
        });
    });

// ================================= Quản lý tài khoản ================================================

Route::middleware(['auth:api'])
    ->prefix('users')
    ->group(function () {
        // 0. Lấy danh sách người dùng (filter, phân trang)
        Route::get('/', [UserController::class, 'index'])->middleware('role:admin,cvcc');

        // 1. Xem chi tiết người dùng
        Route::get('/{user}', [UserController::class, 'show'])->middleware('role:admin,cvcc');

        // 2. Tạo tài khoản (Admin, CVCC)
        Route::post('/', [UserController::class, 'store'])->middleware('role:admin,cvcc');

        // 3. Cập nhật thông tin người dùng
        Route::put('/{user}', [UserController::class, 'update'])->middleware('role:admin,cvcc');

        // 4. Tạm dừng / kích hoạt tài khoản
        Route::patch('/{user}/status', [UserController::class, 'toggleStatus'])->middleware('role:admin,cvcc');

        // 5. Duyệt doanh nghiệp đăng ký
        Route::patch('/{user}/review', [UserController::class, 'reviewEnterprise'])->middleware('role:admin,cvcc,cvql');

        // 6. Cập nhật thông tin cá nhân (chính mình)
        Route::put('/me/profile', [UserController::class, 'updateProfile']);

        // 7. Xem log truy cập (đã có)
        Route::get('/{user}/login-logs', [UserController::class, 'getLoginLogs']);

        // 8. API kiểm tra dữ liệu liên quan trước khi xóa
        Route::get('/{user}/check-delete', [UserController::class, 'checkDelete'])->middleware('role:admin,cvcc');

        // 9. API xóa tài khoản
        Route::delete('/{user}', [UserController::class, 'destroy'])->middleware('role:admin,cvcc');

        // 10. Phân quyền tài khoản hệ thống
        Route::patch('/{user}/assign-role', [UserController::class, 'assignRole'])->middleware('role:admin,cvcc');

        // 11. Xoá log đăng nhập
        Route::delete('/login-logs/{logId}', [UserController::class, 'deleteLoginLog'])
            ->middleware('role:admin,cvcc');

    });


// ============================== Quản lý vi phạm =============================================

Route::middleware(['auth:api'])
    ->prefix('violations')
    ->group(function () {

        // 📌 [User] – Xem danh sách cảnh báo của chính mình
        // ⬅️ Policy: không cần (lấy theo user đăng nhập)
        Route::get('/me', [ViolationController::class, 'myViolations']);

        // 📌 [ADMIN|CVCC|CVQL] – Xem danh sách tất cả cảnh báo (lọc, phân trang)
        // ⬅️ Kiểm soát role qua middleware
        Route::get('/', [ViolationController::class, 'index'])->middleware('role:admin,cvcc,cvql');

        // 📌 [ADMIN|CVCC|CVQL] – Xem cảnh báo của người dùng cụ thể
        // ⬅️ Kiểm soát role qua middleware
        Route::get('/users/{id}', [ViolationController::class, 'getByUser'])->middleware('role:admin,cvcc,cvql');

        // 📌 [ADMIN|CVCC] – Gửi cảnh báo vi phạm cho người dùng
        // ⬅️ Policy: warn (không được tự cảnh báo mình, chỉ cảnh báo cấp thấp hơn)
        Route::post('/users/{id}/warn', [ViolationController::class, 'warn'])->middleware('role:admin,cvcc');

        // 📌 [ADMIN|CVCC] – Xóa cảnh báo vi phạm
        // ⬅️ Policy: delete (chỉ được xóa cảnh báo của user có cấp thấp hơn)
        Route::delete('/{id}', [ViolationController::class, 'destroy'])->middleware('role:admin,cvcc');

    });





// =========================== Thông tin doanh nghiệp ===============================================

Route::prefix('enterprises')
    ->middleware('auth:api')
    ->group(function () {
        // ✅ [ADMIN|CVCC|CVQL] – Lấy danh sách doanh nghiệp (lọc, phân trang)
        // ⬅️ Không cần policy – lọc theo điều kiện trong service
        Route::get('/', [EnterpriseController::class, 'index'])
            ->middleware('role:admin,cvcc,cvql');

        // ✅ Danh sách doanh nghiệp đơn giản (filter dropdown)
        Route::get('/simple', [EnterpriseController::class, 'simple'])
            ->middleware('role:admin,cvcc,cvql');

        // ✅ [ADMIN|CVCC|CVQL|DN] – Xem chi tiết hồ sơ doanh nghiệp
        // ⬅️ Policy: view
        Route::get('/{enterprise}', [EnterpriseController::class, 'show'])
            ->middleware('role:admin,cvcc,cvql,dn');

        // ✅ [DN] – Cập nhật hồ sơ doanh nghiệp của chính mình
        // ⬅️ Policy: update
        Route::put('/{enterprise}', [EnterpriseController::class, 'update'])
            ->middleware('role:dn');

        // ✅ [DN] – Upload tài liệu hồ sơ
        // ⬅️ Policy: update
        Route::post('/{enterprise}/upload-documents', [EnterpriseController::class, 'uploadDocuments'])
            ->middleware('role:dn');

        // ✅ [Tất cả role] – Xem tài liệu doanh nghiệp (có kiểm tra quyền truy cập)
        // ⬅️ (Xác thực quyền trong DocumentController nếu có)
        Route::get('/{enterprise}/documents/{filename}', [DocumentController::class, 'viewDocument']);

        // ✅ [ADMIN|CVCC|CVQL] – Duyệt hồ sơ doanh nghiệp
        // ⬅️ Policy: review (trạng thái: pending)
        Route::patch('/{enterprise}/approve', [EnterpriseController::class, 'approve'])
            ->middleware('role:admin,cvcc,cvql');

        // ✅ [ADMIN|CVCC|CVQL] – Từ chối hồ sơ doanh nghiệp
        // ⬅️ Policy: reject (trạng thái: pending)
        Route::patch('/{enterprise}/reject', [EnterpriseController::class, 'reject'])
            ->middleware('role:admin,cvcc,cvql');

        // ✅ [ADMIN|CVCC] – Tạm ngưng hoạt động doanh nghiệp
        // ⬅️ Policy: suspend (trạng thái: approved)
        Route::patch('/{enterprise}/suspend', [EnterpriseController::class, 'suspend'])
            ->middleware('role:admin,cvcc');

        // ✅ [ADMIN|CVCC] – Mở lại hoạt động doanh nghiệp
        // ⬅️ Policy: resume (trạng thái: suspended)
        Route::patch('/{enterprise}/resume', [EnterpriseController::class, 'resume'])
            ->middleware('role:admin,cvcc');

        // ✅ [DN] – Xoá tài liệu của chính doanh nghiệp mình
        // ⬅️ Policy: update
        Route::delete('/{enterprise}/documents/{filename}', [EnterpriseController::class, 'deleteDocument'])
            ->middleware('role:dn');
    });




// =========================== Thông tin khách hàng ===================================================

Route::prefix('customers')
    ->middleware('auth:api')
    ->group(function () {

        // ✅ [ADMIN|CSKH|CVCC|CVQL] – Lấy danh sách khách hàng
        // ⬅️ (Chưa kiểm tra policy, lọc theo service)
        Route::get('/', [CustomerController::class, 'index'])
            ->middleware('role:admin,cskh,cvcc,cvql');

        // ✅ [ADMIN|CSKH|CVCC|CVQL|KH] – Xem chi tiết khách hàng
        // ⬅️ Policy: view
        Route::get('/{id}', [CustomerController::class, 'show'])
            ->middleware('role:admin,cskh,cvcc,cvql,kh');

        // ✅ [ADMIN|CVCC|KH] – Cập nhật thông tin khách hàng
        // ⬅️ Policy: update
        Route::put('/{customer}', [CustomerController::class, 'update'])
            ->middleware('role:admin,cvcc,kh');

        // ✅ [ADMIN|KH] – Cập nhật avatar
        // ⬅️ Policy: uploadAvatar
        Route::post('/{customer}/avatar', [CustomerController::class, 'uploadAvatar'])
            ->middleware('role:admin,kh');
    });



// ============================== Danh mục không gian trưng bày ==========================================
Route::prefix('exhibition-space-categories')
    ->middleware(['auth:api'])
    ->group(function () {

        // ✅ [ADMIN] – Xem danh sách danh mục
        Route::get('/', [ExhibitionSpaceCategoryController::class, 'index']); // GET /api/exhibition-space-categories
    
        // ✅ [Public] – Lấy danh sách dạng cây
        Route::get('/tree', [ExhibitionSpaceCategoryController::class, 'tree']); // GET /api/exhibition-space-categories/tree
    
        // ✅ [ADMIN] – Xem chi tiết một danh mục
        Route::get('/{category}', [ExhibitionSpaceCategoryController::class, 'show']); // GET /api/exhibition-space-categories/{id}
    
        // ✅ [ADMIN] – Tạo mới danh mục
        Route::post('/', [ExhibitionSpaceCategoryController::class, 'store']); // POST /api/exhibition-space-categories
    
        // ✅ [ADMIN] – Cập nhật danh mục
        Route::put('/{category}', [ExhibitionSpaceCategoryController::class, 'update']); // PUT /api/exhibition-space-categories/{id}
    
        // ✅ [ADMIN] – Xóa danh mục
        Route::delete('/{category}', [ExhibitionSpaceCategoryController::class, 'destroy']); // DELETE /api/exhibition-space-categories/{id}
    });



// ========================== Không gian trưng bày ======================================================
Route::prefix('exhibition-spaces')
    ->middleware(['auth:api'])
    ->group(function () {

        // ✅ [Public] – Xem danh sách không gian trưng bày
        Route::get('/', [ExhibitionSpaceController::class, 'index']); // GET /api/exhibition-spaces
    
        // ✅ [Public] – Xem danh sách không gian trưng bày
        Route::get('/selectable', [ExhibitionSpaceController::class, 'selectable']);

        // ✅ [Public] – Xem chi tiết 1 không gian
        Route::get('/{exhibition_space}', [ExhibitionSpaceController::class, 'show']); // GET /api/exhibition-spaces/{id}
    
        // ✅ [ADMIN] – Tạo mới không gian trưng bày
        // ⬅️ Policy: create
        Route::post('/', [ExhibitionSpaceController::class, 'store']); // POST /api/exhibition-spaces
    
        // ✅ [ADMIN] – Cập nhật thông tin không gian
        // ⬅️ Policy: update
        Route::put('/{exhibition_space}', [ExhibitionSpaceController::class, 'update']); // PUT /api/exhibition-spaces/{id}
    
        // ✅ [ADMIN] – Cập nhật trạng thái không gian (trống, đang dùng, bảo trì)
        // ⬅️ Policy: changeStatus
        Route::patch('/{exhibition_space}/status', [ExhibitionSpaceController::class, 'updateStatus']); // PATCH /api/exhibition-spaces/{id}/status
    
        // ✅ [ADMIN] – Xóa không gian nếu chưa có doanh nghiệp thuê
        // ⬅️ Policy: delete
        Route::delete('/{exhibition_space}', [ExhibitionSpaceController::class, 'destroy']); // DELETE /api/exhibition-spaces/{id}
    
        // ✅ [ADMIN, CVCC, CVQL, QLGH] – Xem danh sách doanh nghiệp đang thuê 1 không gian
        // ⬅️ Policy: viewAny
        Route::get('/{exhibition_space}/enterprises', [ExhibitionSpaceController::class, 'listEnterprisesInSpace']);
    });

// ========================= Tài liệu không gian trưng bày (ảnh 360) ==============================================
Route::prefix('exhibition-spaces/{space}/media')
    ->middleware(['auth:api']) // ✅ Chỉ yêu cầu đăng nhập, phân quyền xử lý bằng policy
    ->group(function () {

        // ✅ [ADMIN, CVCC, CVQL]
        // 📝 Upload media (ảnh 360, video, tài liệu) cho không gian trưng bày
        // ⬅️ ExhibitionMediaPolicy@create
        Route::post('/upload', [ExhibitionMediaController::class, 'upload']);

        // ✅ [ADMIN, CVCC, CVQL]
        // 📝 Cập nhật thông tin media (file, caption, thứ tự...) của không gian
        // ⬅️ ExhibitionMediaPolicy@update
        Route::post('{media}/update', [ExhibitionMediaController::class, 'update']);

        // ✅ [ADMIN, CVCC]
        // 🗑️ Xóa media khỏi không gian (kèm xoá file lưu trữ)
        // ⬅️ ExhibitionMediaPolicy@delete
        Route::delete('{media}', [ExhibitionMediaController::class, 'destroy']);
    });



//  =============================== Hợp đồng thuê không gian trưng bày ============================
Route::prefix('rental-contracts')
    ->middleware(['auth:api'])
    ->group(function () {
        // ✅ [ADMIN, CVCC] – Tạo hợp đồng thuê offline
        // → Policy: RentalContractPolicy@createOffline
        Route::post('/offline', [RentalContractController::class, 'storeOffline']);

        // Dách sách không gian 
        Route::get('/', [RentalContractController::class, 'index']);

        //  [DN, NVDN] – Gửi yêu cầu thuê không gian
        // → Policy: RentalContractPolicy@create
        Route::post('/', [RentalContractController::class, 'store']);

        //  [ADMIN, CVCC] – Duyệt hợp đồng (chỉ khi đang pending)
        // → Policy: RentalContractPolicy@approve
        Route::patch('{id}/approve', [RentalContractController::class, 'approve']);

        //  [DN, NVDN] – Yêu cầu hủy nếu chưa được duyệt
        // → Policy: RentalContractPolicy@cancel
        Route::patch('{id}/cancel', [RentalContractController::class, 'cancel']);

        //  [DN, NVDN] – Yêu cầu gia hạn nếu đã được duyệt
        // → Policy: RentalContractPolicy@extend
        Route::patch('{id}/extend', [RentalContractController::class, 'extend']);

        //  [QTHT, CVCC, CVQL, QLGH] – Danh sách hợp đồng đang hoạt động
        // → Policy: RentalContractPolicy@viewAny
        Route::get('/active', [RentalContractController::class, 'listActiveContracts']);

        //  [DN, NVDN] – Lịch sử hợp đồng của DN hiện tại
        // → Policy: RentalContractPolicy@viewAny
        Route::get('/mine', [RentalContractController::class, 'listMyContracts']);

        //  [ADMIN, CVCC] – Từ chối hợp đồng đang pending
        // → Policy: RentalContractPolicy@reject
        Route::patch('{id}/reject', [RentalContractController::class, 'reject']);

        //  [QTHT, CVCC, DN, NVDN] – Xem chi tiết hợp đồng
        // → Policy: RentalContractPolicy@view
        Route::get('/{id}', [RentalContractController::class, 'show']);

        // Xóa
        Route::delete('{id}', [RentalContractController::class, 'destroy']);
        // Xử lý gia hạn
        Route::patch('{id}/handle-extend', [RentalContractController::class, 'handleExtend']);
        // Xem trước giá gia hạn
        Route::get('{id}/preview-extend', [RentalContractController::class, 'previewExtendCost']);

    });



// ========================= Sản phẩm trưng bày trong không gian ============================
Route::prefix('exhibition-space-products')
    ->middleware(['auth:api'])
    ->group(function () {
        // [ADMIN, CVCC] – Lọc danh sách sản phẩm trưng bày để duyệt
// → Policy: ExhibitionSpaceProductPolicy@viewAny
        Route::get('/', [ExhibitionSpaceProductController::class, 'index']);

        // Lấy danh sách sản phẩm theo hợp đồng
        Route::get('by-contract/{contract}', [ExhibitionSpaceProductController::class, 'getByContract']);

        //  [DN, NVDN] – Thêm sản phẩm vào không gian thuê
        // → Policy: ExhibitionSpaceProductPolicy@create
        Route::post('/', [ExhibitionSpaceProductController::class, 'store']);

        //  [DN, NVDN] – Cập nhật thông tin sản phẩm
        // → Policy: ExhibitionSpaceProductPolicy@update
        Route::patch('/{exhibitionSpaceProduct}', [ExhibitionSpaceProductController::class, 'update']);

        //  [DN, NVDN] – Xoá sản phẩm khỏi không gian thuê
        // → Policy: ExhibitionSpaceProductPolicy@delete
        Route::delete('/{exhibitionSpaceProduct}', [ExhibitionSpaceProductController::class, 'destroy']);

        //  [ADMIN, CVCC] – Duyệt hoặc từ chối sản phẩm trưng bày
        // → Policy: ExhibitionSpaceProductPolicy@approve
        Route::patch('/{exhibitionSpaceProduct}/approve', [ExhibitionSpaceProductController::class, 'approve']);

        //  [DN, NVDN] – Xem danh sách sản phẩm mình đã gửi yêu cầu trưng bày
        // → Không cần policy riêng, dùng auth và scope theo doanh nghiệp
        Route::get('/mine', [ExhibitionSpaceProductController::class, 'indexMine']);
    });


// ========================= Phản hồi không gian trưng bày =========================================
Route::prefix('feedbacks')->group(function () {

    // 🟢 Gửi phản hồi
    // ✅ Cho phép: DN, NVDN, KH
    Route::post('/', [FeedbackController::class, 'store']);

    // 🟢 Danh sách tất cả phản hồi (có filter)
    // ✅ Cho phép: tất cả role (lọc bằng policy + filter)
    Route::get('/', [FeedbackController::class, 'index']);

    // DS Phản hồi của 1 đối đượng
    Route::get('/by-target', [FeedbackController::class, 'getByTarget']);
    // Thống kê
    Route::get('/statistics', [FeedbackController::class, 'statistics']);

    // 🟢 Danh sách phản hồi của chính mình
    // ✅ Cho phép: tất cả role
    Route::get('/mine', [FeedbackController::class, 'indexMine']);

    // 🟢 Xem chi tiết phản hồi
    // ✅ Cho phép: người gửi, DN, NVDN, hệ thống (admin, cvql, ...)
    Route::get('{feedback}', [FeedbackController::class, 'show']);

    // 🟢 Trả lời phản hồi
    // ✅ Cho phép: DN, NVDN, hệ thống (admin, cvql, ...)
    Route::post('{feedback}/reply', [FeedbackController::class, 'reply']);

    // 🔴 Xoá phản hồi
    // ✅ Cho phép: người gửi, hệ thống (admin, cvql, ...)
    Route::delete('{feedback}', [FeedbackController::class, 'destroy']);


});




// ========================= Danh mục sản phẩm ===========================
Route::prefix('categories')
    ->middleware(['auth:api'])
    ->group(function () {

        // [QTHT, DN, NVDN] – Xem danh sách danh mục sản phẩm
        // → Policy: CategoryPolicy@viewAny
        Route::get('/', [CategoryController::class, 'index']);

        // ✅ MỚI – Lấy danh mục dạng cây
        // [QTHT, DN, NVDN] – Xem danh sách danh mục dạng cây
        // → Policy: CategoryPolicy@viewAny
        Route::get('/tree', [CategoryController::class, 'tree']);
        // [QTHT, DN, NVDN] – Xem chi tiết danh mục sản phẩm
// → Policy: CategoryPolicy@view
        Route::get('{category}', [CategoryController::class, 'show']);

        //  [QTHT] – Tạo mới danh mục sản phẩm
        // → Policy: CategoryPolicy@create
        Route::post('/', [CategoryController::class, 'store']);

        //  [QTHT] – Cập nhật danh mục sản phẩm
        // → Policy: CategoryPolicy@update
        Route::patch('{category}', [CategoryController::class, 'update']);

        //  [QTHT] – Xoá danh mục sản phẩm
        // → Policy: CategoryPolicy@delete
        Route::delete('{category}', [CategoryController::class, 'destroy']);
    });



// ========================= Sản phẩm ================================================================
//  DN
Route::prefix('products')->middleware(['auth:api'])->group(function () {
    // [CÔNG KHAI + DN] – Tìm kiếm sản phẩm
    // → Không yêu cầu policy (xem công khai hoặc sản phẩm của DN)
    Route::get('/', [ProductController::class, 'index']);

    // [DN] – Điều chỉnh tồn kho
    // → Policy: ProductPolicy@adjustStock
    Route::post('{id}/adjust-stock', [ProductController::class, 'adjustStock']);

    Route::get('/compact', [ProductController::class, 'getCompactByEnterprise']);
    // [DN] – Gửi duyệt sản phẩm (từ DRAFT → PENDING)
    // → Policy: ProductPolicy@submit
    Route::post('{product}/submit', [ProductController::class, 'submit']);

    // [DN] – Cập nhật trạng thái sản phẩm (trừ duyệt/từ chối)
    Route::put('{product}/status', [ProductController::class, 'updateOwnStatus']);

    // [DN] – Xem lịch sử tồn kho
    // → Policy: ProductPolicy@viewStockLogs
    Route::get('{id}/stock-logs', [ProductController::class, 'stockLogs']);

    // [DN] – Xem tồn kho và giá vốn trung bình của sản phẩm
    Route::get('{productId}/stock-summary', [ProductStockSummaryController::class, 'show']);

    // [DN] – Tạo sản phẩm mới
    // → Policy: ProductPolicy@create
    Route::post('/', [ProductController::class, 'store']);

    // [DN] – Cập nhật sản phẩm
    // → Policy: ProductPolicy@update
    Route::put('{id}', [ProductController::class, 'update']);

    // [DN + QTHT] – Xoá sản phẩm
    // → Policy: ProductPolicy@delete (DN) hoặc ProductPolicy@adminDelete (QTHT)
    Route::delete('{id}', [ProductController::class, 'destroy']);

    // [DN + QTHT] – Xoá sản phẩm
    Route::post('{id}/restore', [ProductController::class, 'restore']);

    // [DN] – Tải ảnh sản phẩm
    // → Policy: ProductPolicy@update
    Route::post('{id}/images', [ProductImageController::class, 'store']);

    // [DN] – Đặt ảnh làm ảnh đại diện
    // → Policy: ProductPolicy@update
    Route::put('{productId}/images/{imageId}/main', [ProductImageController::class, 'setMain']);

    // [DN] – Xoá ảnh khỏi sản phẩm
    // → Policy: ProductPolicy@update
    Route::delete('{productId}/images/{imageId}', [ProductImageController::class, 'destroy']);

    // [DN] – Xem chi tiết sản phẩm KHÔNG tăng views
    // → Policy: ProductPolicy@view
    Route::get('{id}', [ProductController::class, 'getById']);
});
// [PUBLIC] xem chi tiết sản phẩm (KHÔNG auth)
Route::get('/products/{id}/detail', [ProductController::class, 'show']);


// QTHT – Tách riêng để rõ quyền hơn
Route::prefix('admin/products')->middleware(['auth:api'])->group(function () {
    // [QTHT] – Tạo sản phẩm (dạng public, không cần duyệt)
    // → Policy: ProductPolicy@adminStore
    Route::post('/', [ProductController::class, 'adminStore']);

    // [QTHT] – Cập nhật sản phẩm
    // → Policy: ProductPolicy@adminUpdate
    Route::put('{id}', [ProductController::class, 'adminUpdate']);

    // [QTHT] – Xoá sản phẩm
    // → Policy: ProductPolicy@adminDelete
    Route::delete('{id}', [ProductController::class, 'destroy']);

    // [QTHT] – Duyệt sản phẩm
    // → Policy: ProductPolicy@approve
    Route::put('{id}/status', [ProductController::class, 'updateStatus']);

    // [QTHT] – Tải ảnh sản phẩm
    // → Policy: ProductPolicy@adminUpdate (hoặc updateImage)
    Route::post('{id}/images', [ProductImageController::class, 'store']);

    // [QTHT] – Đặt ảnh làm ảnh đại diện
    Route::put('{productId}/images/{imageId}/main', [ProductImageController::class, 'setMain']);

    // [QTHT] – Xoá ảnh khỏi sản phẩm
    Route::delete('{productId}/images/{imageId}', [ProductImageController::class, 'destroy']);

});


// ============================= Danh mục tin tức - sự kiện ===========================================
Route::prefix('news-categories')
    ->middleware(['auth:api']) // JWT guard
    ->group(function () {

        /**
         * CRUD chính
         */
        Route::get('/', [NewsCategoryController::class, 'index']);       // GET danh sách
        Route::post('/', [NewsCategoryController::class, 'store']);      // POST tạo mới
        Route::get('/tree', [NewsCategoryController::class, 'tree']);    // GET cây danh mục
        Route::get('/{id}', [NewsCategoryController::class, 'show']);    // GET chi tiết
        Route::put('/{id}', [NewsCategoryController::class, 'update']);  // PUT cập nhật
        Route::delete('/{id}', [NewsCategoryController::class, 'destroy']); // DELETE mềm
    
        /**
         * Soft delete & thao tác đặc biệt
         */
        Route::patch('/{id}/restore', [NewsCategoryController::class, 'restore']); // PATCH khôi phục
        Route::delete('/{id}/force-delete', [NewsCategoryController::class, 'forceDelete']); // DELETE vĩnh viễn
    });

// ============================= Danh mục dịch vụ ===========================================
Route::prefix('service-categories')
    ->middleware(['auth:api']) // JWT guard
    ->group(function () {

        /**
         * CRUD chính
         */
        Route::get('/', [ServiceCategoryController::class, 'index']);        // GET danh sách
        Route::post('/', [ServiceCategoryController::class, 'store']);       // POST tạo mới
        Route::get('/tree', [ServiceCategoryController::class, 'tree']);     // GET cây danh mục
        Route::get('/{id}', [ServiceCategoryController::class, 'show']);     // GET chi tiết
        Route::put('/{id}', [ServiceCategoryController::class, 'update']);   // PUT cập nhật
        Route::delete('/{id}', [ServiceCategoryController::class, 'destroy']); // DELETE mềm
    
        /**
         * Soft delete & thao tác đặc biệt
         */
        Route::patch('/{id}/restore', [ServiceCategoryController::class, 'restore']);        // PATCH khôi phục
        Route::delete('/{id}/force-delete', [ServiceCategoryController::class, 'forceDelete']); // DELETE vĩnh viễn
    });


// ============================= Bài viết ===========================================
Route::prefix('posts')
    ->middleware(['auth:api']) // JWT guard
    ->group(function () {
        Route::get('/', [PostController::class, 'index']);           // GET danh sách bài viết
        Route::post('/', [PostController::class, 'store']);          // POST tạo mới bài viết
        Route::get('/{id}', [PostController::class, 'show']);        // GET chi tiết bài viết
        Route::put('/{id}', [PostController::class, 'update']);      // PUT cập nhật bài viết
        Route::delete('/{id}', [PostController::class, 'destroy']);  // DELETE mềm bài viết
    
        // Soft delete & thao tác đặc biệt
        Route::patch('/{id}/restore', [PostController::class, 'restore']);         // PATCH khôi phục bài viết
        Route::delete('/{id}/force-delete', [PostController::class, 'forceDelete']); // DELETE vĩnh viễn bài viết
    });


// ============================= Dịch vụ ===========================================
Route::prefix('services')
    ->middleware(['auth:api']) // JWT guard
    ->group(function () {
        Route::get('/', [ServiceController::class, 'index']);           // GET danh sách dịch vụ
        Route::post('/', [ServiceController::class, 'store']);          // POST tạo mới dịch vụ
        Route::get('/{id}', [ServiceController::class, 'show']);        // GET chi tiết dịch vụ
        Route::put('/{id}', [ServiceController::class, 'update']);      // PUT cập nhật dịch vụ
        Route::delete('/{id}', [ServiceController::class, 'destroy']);  // DELETE mềm dịch vụ
    
        // Soft delete & thao tác đặc biệt
        Route::patch('/{id}/restore', [ServiceController::class, 'restore']);         // PATCH khôi phục dịch vụ
        Route::delete('/{id}/force-delete', [ServiceController::class, 'forceDelete']); // DELETE vĩnh viễn dịch vụ
    });


// =================================== Tags ================================================
Route::prefix('tags')->middleware(['auth:api'])->group(function () {
    // CRUD chính
    Route::get('/', [TagController::class, 'index'])->name('index');
    Route::post('/', [TagController::class, 'store'])->name('store');
    Route::get('/{id}', [TagController::class, 'show'])->name('show');
    Route::put('/{id}', [TagController::class, 'update'])->name('update');
    Route::delete('/{id}', [TagController::class, 'destroy'])->name('destroy');

    // Soft delete + restore + force delete
    Route::patch('/{id}/restore', [TagController::class, 'restore'])->name('restore');
    Route::delete('/{id}/force', [TagController::class, 'forceDelete'])->name('force-delete');

    // Attach / detach tags vào model bất kỳ
    Route::post('/attach/{type}/{id}', [TagController::class, 'attach'])->name('attach');
    Route::post('/detach/{type}/{id}', [TagController::class, 'detach'])->name('detach');
});



// ======================== Media ===============================================
Route::prefix('media')->middleware(['auth:api'])->group(function () {
    // Các route tĩnh trước
    Route::get('/for', [MediaController::class, 'getMediaFor']);    // GET /api/media/for

    // Danh sách & chi tiết
    Route::get('/', [MediaController::class, 'index']);            // GET /api/media
    Route::get('/{id}', [MediaController::class, 'show']);        // GET /api/media/{id}

    // Upload, cập nhật, xóa
    Route::post('/', [MediaController::class, 'store']);           // POST /api/media
    Route::put('/{id}', [MediaController::class, 'update']);      // PUT /api/media/{id}
    Route::delete('/{id}', [MediaController::class, 'destroy']);  // DELETE /api/media/{id}

    // Khôi phục / xóa vĩnh viễn
    Route::patch('/{id}/restore', [MediaController::class, 'restore']);     // PATCH /api/media/{id}/restore
    Route::delete('/{id}/force', [MediaController::class, 'forceDelete']); // DELETE /api/media/{id}/force

    // Gán / gỡ Media vào model
    Route::post('/attach', [MediaController::class, 'attachTo']);   // POST /api/media/attach
    Route::post('/detach', [MediaController::class, 'detachFrom']); // POST /api/media/detach
});


// ========================== Order ==========================
Route::prefix('orders')->middleware(['auth:api'])->group(function () {

    // Danh sách đơn hàng (có filter + pagination)
    Route::get('/', [OrderController::class, 'index']);

    // Tạo đơn hàng
    Route::post('/', [OrderController::class, 'store']);

    // Lấy chi tiết đơn hàng
    Route::get('{id}', [OrderController::class, 'show']);

    // Cập nhật trạng thái đơn hàng (chưa test)
    Route::patch('{id}/status', [OrderController::class, 'updateStatus']);

    // Tạo transaction cho đơn hàng
    Route::post('{id}/transactions', [OrderController::class, 'createTransaction']);

    // Xoá mềm
    Route::delete('{id}', [OrderController::class, 'destroy']);

    // Khôi phục
    Route::post('{id}/restore', [OrderController::class, 'restore']);

    // Xoá vĩnh viễn
    Route::delete('{id}/force', [OrderController::class, 'forceDelete']);
});