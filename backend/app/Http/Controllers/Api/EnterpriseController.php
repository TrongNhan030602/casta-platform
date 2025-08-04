<?php

namespace App\Http\Controllers\Api;

use App\Models\Enterprise;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\EnterpriseService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Auth\Access\AuthorizationException;
use App\Http\Resources\Enterprise\EnterpriseResource;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\EnterpriseRequest\IndexEnterpriseRequest;
use App\Http\Requests\EnterpriseRequest\UpdateEnterpriseRequest;

class EnterpriseController extends Controller
{
    use AuthorizesRequests;

    protected EnterpriseService $enterpriseService;

    public function __construct(EnterpriseService $enterpriseService)
    {
        $this->enterpriseService = $enterpriseService;
    }

    public function index(IndexEnterpriseRequest $request): JsonResponse
    {
        $enterprises = $this->enterpriseService->getEnterprises($request->validated());

        return response()->json([
            'data' => EnterpriseResource::collection($enterprises),
            'meta' => [
                'current_page' => $enterprises->currentPage(),
                'last_page' => $enterprises->lastPage(),
                'per_page' => $enterprises->perPage(),
                'total' => $enterprises->total(),
            ],
        ]);
    }

    public function simple(Request $request): JsonResponse
    {
        $keyword = $request->input('keyword');
        $limit = (int) $request->input('limit', 100);

        $enterprises = $this->enterpriseService->getSimpleList($keyword, $limit);

        return response()->json([
            'data' => $enterprises->map(function ($e) {
                return [
                    'id' => $e->id,
                    'name' => $e->company_name,
                ];
            }),
        ]);
    }


    public function show(int $id): JsonResponse
    {
        $enterprise = $this->enterpriseService->getEnterpriseById($id);
        if (!$enterprise) {
            return response()->json(['message' => 'Không tìm thấy doanh nghiệp'], 404);
        }

        try {
            $this->authorize('view', $enterprise);
            return response()->json(new EnterpriseResource($enterprise));
        } catch (AuthorizationException $e) {
            return response()->json(['message' => 'Bạn không có quyền xem hồ sơ doanh nghiệp.'], 403);
        }
    }



    public function update(UpdateEnterpriseRequest $request, Enterprise $enterprise): JsonResponse
    {
        try {
            $this->authorize('update', $enterprise);
            $this->enterpriseService->updateEnterprise($enterprise, $request->validated());
            return response()->json(['message' => 'Cập nhật doanh nghiệp thành công.']);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => 'Bạn không có quyền cập nhật hồ sơ doanh nghiệp.'], 403);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Lỗi cập nhật doanh nghiệp.', 'error' => $e->getMessage()], 500);
        }
    }
    public function uploadDocuments(Request $request, Enterprise $enterprise): JsonResponse
    {
        $this->authorize('update', $enterprise);

        $request->validate([
            'documents.*' => 'required|file|mimes:pdf,jpg,jpeg,png,svg,doc,docx,xls,xlsx,txt|max:5120',
        ]);


        $uploadedFiles = [];

        foreach ($request->file('documents', []) as $file) {
            $path = Storage::disk('private')->put('enterprise_documents', $file);
            $uploadedFiles[] = [
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
            ];
        }

        // Chuyển các file cũ về định dạng object nếu là string
        $existingDocs = collect($enterprise->documents ?? [])
            ->map(function ($doc) {
                return is_string($doc)
                    ? ['path' => $doc, 'original_name' => basename($doc)]
                    : $doc;
            });

        // Gộp lại
        $enterprise->documents = $existingDocs->merge($uploadedFiles)->values()->all();
        $enterprise->save();

        return response()->json([
            'message' => 'Tải lên tài liệu thành công',
            'documents' => $enterprise->documents,
        ]);
    }

    public function deleteDocument(Request $request, Enterprise $enterprise, string $filename): JsonResponse
    {
        $this->authorize('update', $enterprise);

        $documents = collect($enterprise->documents ?? [])
            ->map(function ($doc) {
                return is_string($doc)
                    ? ['path' => $doc, 'original_name' => basename($doc)]
                    : $doc;
            });

        // Tìm file cần xoá
        $deleted = $documents->first(fn($doc) => basename($doc['path']) === $filename);

        if (!$deleted) {
            return response()->json(['message' => 'Không tìm thấy tài liệu để xoá.'], 404);
        }

        // Xoá file vật lý
        Storage::disk('private')->delete($deleted['path']);

        // Cập nhật lại danh sách
        $filtered = $documents->reject(fn($doc) => basename($doc['path']) === $filename);

        $enterprise->documents = $filtered->values()->all();
        $enterprise->save();

        return response()->json(['message' => 'Đã xoá tài liệu thành công.']);
    }




    public function approve(Enterprise $enterprise): JsonResponse
    {
        try {
            $this->authorize('review', $enterprise);
            $this->enterpriseService->approveEnterprise($enterprise, auth()->id());
            return response()->json(['message' => 'Hồ sơ doanh nghiệp đã được duyệt.']);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => 'Bạn không có quyền duyệt hồ sơ doanh nghiệp.'], 403);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Lỗi duyệt hồ sơ.', 'error' => $e->getMessage()], 500);
        }
    }

    public function reject(Enterprise $enterprise): JsonResponse
    {
        try {
            $this->authorize('reject', $enterprise);
            $this->enterpriseService->rejectEnterprise($enterprise, auth()->id());
            return response()->json(['message' => 'Hồ sơ doanh nghiệp đã bị từ chối.']);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => 'Bạn không có quyền từ chối hồ sơ.'], 403);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Lỗi từ chối hồ sơ.', 'error' => $e->getMessage()], 500);
        }
    }

    public function suspend(Enterprise $enterprise): JsonResponse
    {
        try {
            $this->authorize('suspend', $enterprise);
            $this->enterpriseService->suspendEnterprise($enterprise);
            return response()->json(['message' => 'Doanh nghiệp đã bị tạm ngưng.']);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => 'Bạn không có quyền tạm ngưng doanh nghiệp.'], 403);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Lỗi tạm ngưng doanh nghiệp.', 'error' => $e->getMessage()], 500);
        }
    }



    public function resume(Enterprise $enterprise): JsonResponse
    {
        try {
            $this->authorize('resume', $enterprise); // Nếu có policy, còn không thì bỏ dòng này
            $this->enterpriseService->resumeEnterprise($enterprise);

            return response()->json(['message' => 'Doanh nghiệp đã được mở lại hoạt động.']);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => 'Bạn không có quyền mở lại doanh nghiệp.'], 403);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Lỗi mở lại doanh nghiệp.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}