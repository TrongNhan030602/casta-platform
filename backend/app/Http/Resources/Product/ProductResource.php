<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        $images = $this->images; // ✅ không query lại

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'stock' => $this->stock,

            'discount_price' => $this->discount_price,
            'discount_start_at' => $this->discount_start_at,
            'discount_end_at' => $this->discount_end_at,

            'weight' => $this->weight,
            'dimensions' => $this->dimensions,
            'shipping_type' => $this->shipping_type->value ?? null,

            'views_count' => $this->views_count,
            'purchased_count' => $this->purchased_count,
            'reviews_count' => $this->reviews_count,
            'average_rating' => $this->average_rating,

            'model_3d_url' => $this->model_3d_url,
            'video_url' => $this->video_url,

            'tags' => $this->tags,
            'tag_enums' => $this->tag_enums,

            'category' => [
                'id' => $this->category_id,
                'name' => $this->category?->name,
            ],

            'enterprise' => [
                'id' => $this->enterprise_id,
                'name' => $this->enterprise?->company_name,
            ],

            'images' => $images->map(fn($img) => [
                'id' => $img->id,
                'url' => $img->url,
                'is_main' => (bool) $img->is_main,
            ])->values(),

            'main_image' => $this->main_image, // dùng accessor ở model

            'status' => $this->status->value,
            'approved_by' => $this->approved_by,
            'approved_at' => $this->approved_at,
            'reason_rejected' => $this->reason_rejected,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}