<?php
namespace App\Http\Resources\ServiceCategory;

use Illuminate\Http\Resources\Json\JsonResource;

class ServiceCategoryTreeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'children' => ServiceCategoryTreeResource::collection($this->whenLoaded('children')),
        ];
    }
}