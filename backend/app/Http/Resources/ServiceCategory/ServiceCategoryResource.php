<?php
namespace App\Http\Resources\ServiceCategory;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User\UserCompactResource;

class ServiceCategoryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'parent_id' => $this->parent_id,
            'description' => $this->description ?? '',
            'image_id' => $this->image_id,
            'order' => $this->order ?? 0,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at ? $this->created_at->toDateTimeString() : null,
            'updated_at' => $this->updated_at ? $this->updated_at->toDateTimeString() : null,
            'deleted_at' => $this->deleted_at ? $this->deleted_at->toDateTimeString() : null, // <-- Thêm dòng này

            'parent_category' => $this->whenLoaded('parent') ? new self($this->parent) : null,
            'image' => $this->whenLoaded('image') ? $this->image : null,

            // Thêm user liên quan sử dụng UserCompactResource
            'created_by_user' => $this->whenLoaded('createdBy', function () {
                return new UserCompactResource($this->createdBy);
            }),

            'updated_by_user' => $this->whenLoaded('updatedBy', function () {
                return new UserCompactResource($this->updatedBy);
            }),
        ];
    }
}