<?php
namespace App\Http\Resources\NewsCategory;

use Illuminate\Http\Resources\Json\JsonResource;

class NewsCategoryTreeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'children' => NewsCategoryTreeResource::collection($this->whenLoaded('children')),
        ];
    }
}