<?php

namespace App\Http\Resources\ExhibitionSpaceProduct;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminExhibitionSpaceProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'note' => $this->note,
            'panorama_id' => $this->position_metadata['panoramaId'] ?? null,
            'created_at' => $this->created_at,

            // Chỉ giữ nếu cần hiển thị sơ vị trí
            'position_metadata' => [
                'yaw' => $this->position_metadata['yaw'] ?? null,
                'pitch' => $this->position_metadata['pitch'] ?? null,
                'panoramaId' => $this->position_metadata['panoramaId'] ?? null,
            ],

            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'thumbnail' => $this->product->thumbnail,
                    'price' => $this->product->price,
                    'stock' => $this->product->stock,
                    'category' => $this->product->category?->only(['id', 'name']),
                ];
            }),

            'exhibition_space' => $this->rentalContract?->space?->only(['id', 'name']),

            'rental_contract' => $this->whenLoaded('rentalContract', function () {
                return [
                    'id' => $this->rentalContract->id,
                    'code' => $this->rentalContract->code,
                    'start_date' => $this->rentalContract->start_date,
                    'end_date' => $this->rentalContract->end_date,
                    'enterprise' => $this->rentalContract->enterprise?->only(['id', 'company_name']),
                ];
            }),
        ];
    }
}