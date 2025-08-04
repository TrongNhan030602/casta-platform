<?php

namespace App\Http\Resources\ExhibitionSpaceProduct;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ExhibitionSpaceProduct\ProductResource;

class ExhibitionSpaceProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => new ProductResource($this->whenLoaded('product')),
            'rental_contract_id' => $this->rental_contract_id,
            'space_id' => optional($this->rentalContract)->space_id,
            'status' => $this->status,
            'note' => $this->note,
            'position_metadata' => $this->position_metadata,
            'panorama_id' => $this->position_metadata['panoramaId'] ?? null,

            'created_at' => $this->created_at,
        ];
    }
}