<?php
namespace App\Http\Controllers\Api;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\PostService;
use App\Http\Controllers\BaseApiController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\Post\PostIndexRequest;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Http\Resources\Post\PostResource;

class PostController extends BaseApiController
{
    use AuthorizesRequests, ValidatesRequests;

    protected PostService $service;

    public function __construct(PostService $service)
    {
        $this->service = $service;
    }

    public function index(PostIndexRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('viewAny', Post::class);

            $filters = $request->validated();
            $posts = $this->service->publicSearch($filters);

            return response()->json([
                'data' => PostResource::collection($posts->items()),
                'meta' => $this->meta($posts),  // meta phân trang: tổng, trang hiện tại, tổng trang...
            ]);
        });
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        return $this->safe(function () use ($request) {
            $this->authorize('create', Post::class);

            $post = $this->service->store($request->validated());

            return response()->json([
                'message' => 'Bài viết đã được tạo thành công.',
                'data' => new PostResource($post),
            ], 201);
        });
    }

    public function show(int $id): JsonResponse
    {
        return $this->safe(function () use ($id) {
            $post = $this->service->find($id);
            $this->authorize('view', $post);

            return response()->json([
                'data' => new PostResource($post),
            ]);
        });
    }

    public function update(UpdatePostRequest $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $post = $this->service->find($id);
            $this->authorize('update', $post);

            $updated = $this->service->update($id, $request->validated());

            return response()->json([
                'message' => 'Cập nhật bài viết thành công.',
                'data' => new PostResource($updated),
            ]);
        });
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            $post = $this->service->find($id);
            $this->authorize('delete', $post);

            $cascade = $request->query('cascade') === '1';
            $this->service->delete($id, $cascade);

            return response()->json(['message' => 'Xóa bài viết thành công.']);
        });
    }

    public function restore(Request $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            // Lưu ý: cần dùng withTrashed để tìm record đã xóa mềm
            $post = $this->service->find($id); // cần gọi lại repo với withTrashed trong service/repo cho restore
            $this->authorize('restore', $post);

            $restored = $this->service->restore($id);

            if (!$restored) {
                return response()->json(['message' => 'Khôi phục bài viết thất bại.'], 500);
            }

            return response()->json(['message' => 'Bài viết đã được khôi phục thành công.']);
        });
    }

    public function forceDelete(Request $request, int $id): JsonResponse
    {
        return $this->safe(function () use ($request, $id) {
            // Tương tự restore, tìm với withTrashed để forceDelete
            $post = $this->service->find($id);
            $this->authorize('forceDelete', $post);

            $cascade = $request->query('cascade') === '1';
            $deleted = $this->service->forceDelete($id, $cascade);

            if (!$deleted) {
                return response()->json(['message' => 'Xóa vĩnh viễn bài viết thất bại.'], 500);
            }

            return response()->json(['message' => 'Bài viết đã bị xóa vĩnh viễn.']);
        });
    }
}