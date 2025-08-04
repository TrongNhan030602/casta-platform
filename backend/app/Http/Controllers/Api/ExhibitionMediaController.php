<?php

namespace App\Http\Controllers\Api;

use App\Enums\MediaType;
use Illuminate\Support\Str;
use App\Models\ExhibitionMedia;
use App\Models\ExhibitionSpace;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use App\Services\ExhibitionMediaService;
use App\Http\Controllers\BaseApiController;
use App\Http\Requests\ExhibitionMedia\UpdateMediaRequest;
use App\Http\Requests\ExhibitionMedia\UploadMediaRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ExhibitionMediaController extends BaseApiController
{
    use AuthorizesRequests;

    protected ExhibitionMediaService $service;

    public function __construct(ExhibitionMediaService $service)
    {
        $this->service = $service;
    }

    public function upload(UploadMediaRequest $request, ExhibitionSpace $space): JsonResponse
    {
        return $this->safe(function () use ($request, $space) {
            $this->authorize('create', [ExhibitionMedia::class, $space]);

            $type = $request->input('type');
            $url = null;

            if ($type === MediaType::YOUTUBE) {
                $url = $request->input('url');
            } else {
                $file = $request->file('file');

                if (!$file) {
                    return response()->json([
                        'message' => 'Không tìm thấy file upload.',
                        'error' => 'File rỗng hoặc không hợp lệ.',
                    ], 422);
                }

                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();
                $hashedName = $originalName . '_' . Str::random(20) . '.' . $extension;

                $path = $file->storeAs('exhibition-media', $hashedName, 'public');
                $url = $path;
            }

            $media = $this->service->create($space, [
                'type' => $type,
                'url' => $url,
                'caption' => $request->caption,
                'order' => $request->order,
                'metadata' => $request->metadata,
            ]);

            return response()->json([
                'message' => 'Upload media thành công.',
                'data' => $media,
            ], 201);
        });
    }



    public function update(UpdateMediaRequest $request, ExhibitionSpace $space, ExhibitionMedia $media): JsonResponse
    {
        return $this->safe(function () use ($request, $space, $media) {
            $this->authorize('update', $media);

            if ($media->exhibition_space_id !== $space->id) {
                return response()->json(['message' => 'Media không thuộc không gian này.'], 403);
            }

            $type = $request->input('type') ?? $media->type->value; // fallback khi không gửi type mới

            // Xử lý URL
            if ($type === MediaType::YOUTUBE->value) {
                // Trường hợp link YouTube
                $media->url = $request->input('url');
            } elseif ($request->hasFile('file')) {
                // Trường hợp upload file mới
                $oldPath = str_replace('/storage/', '', $media->url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }

                $file = $request->file('file');
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();
                $hashedName = $originalName . '_' . Str::random(20) . '.' . $extension;

                $newPath = $file->storeAs('exhibition-media', $hashedName, 'public');
                $media->url = $newPath;
            }

            $media->type = $type;
            $media->caption = $request->caption;
            $media->order = $request->order;
            $media->metadata = $request->metadata;
            $media->save();

            return response()->json([
                'message' => 'Cập nhật media thành công.',
                'data' => $media,
            ]);
        });
    }


    public function destroy(ExhibitionSpace $space, ExhibitionMedia $media): JsonResponse
    {
        return $this->safe(function () use ($space, $media) {
            $this->authorize('delete', $media);

            if ($media->exhibition_space_id !== $space->id) {
                return response()->json(['message' => 'Media không thuộc không gian này.'], 403);
            }

            $filePath = str_replace('/storage/', '', $media->url);
            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }

            $this->service->delete($media);

            return response()->json(['message' => 'Xoá media thành công.']);
        });
    }
}