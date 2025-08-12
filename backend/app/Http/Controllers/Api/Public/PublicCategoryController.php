<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\BaseApiController;
use App\Services\CategoryService;
use App\Http\Resources\ProductCategory\CategoryTreeResource;
use Illuminate\Http\JsonResponse;

class PublicCategoryController extends BaseApiController
{
    protected CategoryService $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    public function tree(): JsonResponse
    {
        return $this->safe(function () {
            $filters = [
                'is_active' => 1,
            ];

            $categories = $this->service->getTree($filters);

            return response()->json([
                'data' => CategoryTreeResource::collection($categories),
            ]);
        });
    }
}