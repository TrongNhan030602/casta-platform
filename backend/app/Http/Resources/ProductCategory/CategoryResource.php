<?php
namespace App\Http\Resources\ProductCategory;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'parent_id' => $this->parent_id,
            'parent' => $this->whenLoaded('parent', fn() => new CategoryResource($this->parent)),
        ];
    }
}