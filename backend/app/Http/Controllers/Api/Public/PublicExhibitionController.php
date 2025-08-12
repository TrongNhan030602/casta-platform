<?php

namespace App\Http\Controllers\Api\Public;

use App\Models\RentalContract;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Enums\ExhibitionProductStatus;
use App\Enums\RentalContractStatus;
use App\Http\Resources\Public\PublicExhibitionResource;

class PublicExhibitionController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $contract = RentalContract::with([
            'space.media',
            'space.category',
            'enterprise',
            'spaceProducts' => function ($query) {
                $query->where('status', ExhibitionProductStatus::APPROVED)
                    ->with('product');
            },
        ])
            ->where('is_public', true)
            ->where('public_slug', $slug)
            ->where('status', RentalContractStatus::APPROVED)
            ->whereDate('end_date', '>=', now())
            ->first();

        if (!$contract) {
            return response()->json([
                'message' => 'Không tìm thấy không gian trưng bày.'
            ], 404);
        }

        return response()->json([
            'data' => new PublicExhibitionResource($contract)
        ]);
    }
}