<?php

namespace App\Http\Resources\Post;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value, // Enum PostType
            'title' => $this->title,
            'slug' => $this->slug,

            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => optional($this->category)->id,
                    'name' => optional($this->category)->name,
                ];
            }),

            'summary' => $this->summary,
            'content' => $this->content,
            'media' => $this->whenLoaded('media', function () {
                return $this->media->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'url' => $media->url,
                        'disk' => $media->disk,
                        'meta' => $media->meta,
                    ];
                });
            }),

            'gallery' => $this->gallery, // đã cast array

            'tags' => $this->whenLoaded('tags', function () {
                return $this->tags->map(function ($tag) {
                    return [
                        'id' => $tag->id,
                        'name' => $tag->name,
                    ];
                });
            }, []),

            'status' => $this->status->value, // Enum PostStatus
            'is_sticky' => $this->is_sticky,
            'published_at' => optional($this->published_at)->toDateTimeString(),

            'author' => $this->whenLoaded('author', function () {
                return [
                    'id' => optional($this->author)->id,
                    'name' => optional($this->author)->name,
                ];
            }),

            'event_location' => $this->event_location,
            'event_start' => optional($this->event_start)->toDateTimeString(),
            'event_end' => optional($this->event_end)->toDateTimeString(),

            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,

            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}