<?php

namespace App\Http\Resources\ExhibitionSpaceCategory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExhibitionSpaceCategoryTreeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'children' => ExhibitionSpaceCategoryTreeResource::collection($this->whenLoaded('children')),
        ];
    }
}