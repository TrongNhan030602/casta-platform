<?php

namespace App\Http\Resources\Service;

use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ] : null,
            'summary' => $this->summary,
            'content' => $this->content,
            'price' => $this->price,
            'currency' => $this->currency,
            'duration_minutes' => $this->duration_minutes,
            'features' => $this->features,
            'media' => $this->whenLoaded('media', function () {
                return $this->media->map(fn($media) => [
                    'id' => $media->id,
                    'url' => $media->url,
                    'disk' => $media->disk,
                    'meta' => $media->meta,
                ]);
            }),

            'gallery' => $this->gallery,
            'status' => $this->status->value ?? null,
            'tags' => $this->tags->map(fn($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
            ]),
            'created_by' => $this->createdBy ? [
                'id' => $this->createdBy->id,
                'name' => $this->createdBy->name,
            ] : null,
            'updated_by' => $this->updatedBy ? [
                'id' => $this->updatedBy->id,
                'name' => $this->updatedBy->name,
            ] : null,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'deleted_at' => $this->deleted_at?->toDateTimeString(),
        ];
    }
}