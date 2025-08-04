<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseApiController;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Product;

class ProductImageController extends BaseApiController
{
    use AuthorizesRequests;

    public function store(Request $request, $productId): JsonResponse
    {
        return $this->safe(function () use ($request, $productId) {
            $request->validate([
                'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            ]);

            $product = Product::findOrFail($productId);
            $this->authorize('updateImage', $product);

            $file = $request->file('image');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $hashedName = Str::slug($originalName) . '_' . Str::random(16) . '.' . $extension;

            $path = $file->storeAs('products', $hashedName, 'public');

            $isFirst = $product->images()->count() === 0;

            $productImage = $product->images()->create([
                'url' => $path,
                'is_main' => $isFirst,
            ]);

            return response()->json([
                'message' => 'Ảnh đã được tải lên.',
                'image' => [
                    'id' => $productImage->id,
                    'url' => $productImage->url,
                    'is_main' => $productImage->is_main,
                ],
            ]);
        });
    }

    public function destroy($productId, $imageId): JsonResponse
    {
        return $this->safe(function () use ($productId, $imageId) {
            $product = Product::findOrFail($productId);
            $this->authorize('updateImage', $product);

            $image = $product->images()->where('id', $imageId)->first();
            if (!$image) {
                return response()->json(['message' => 'Không tìm thấy ảnh.'], 404);
            }

            if (Storage::disk('public')->exists($image->url)) {
                Storage::disk('public')->delete($image->url);
            }

            $wasMain = $image->is_main;
            $image->delete();

            if ($wasMain && $product->images()->exists()) {
                $product->images()->first()->update(['is_main' => true]);
            }

            return response()->json(['message' => 'Đã xoá ảnh khỏi sản phẩm.']);
        });
    }

    public function setMain($productId, $imageId): JsonResponse
    {
        return $this->safe(function () use ($productId, $imageId) {
            $product = Product::findOrFail($productId);
            $this->authorize('updateImage', $product);

            $image = $product->images()->where('id', $imageId)->first();
            if (!$image) {
                return response()->json(['message' => 'Không tìm thấy ảnh.'], 404);
            }

            $product->images()->update(['is_main' => false]);
            $image->update(['is_main' => true]);

            return response()->json([
                'message' => 'Đã đặt ảnh làm ảnh đại diện.',
                'image' => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'is_main' => true,
                ],
            ]);
        });
    }
}