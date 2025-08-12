<?php

namespace App\Http\Resources\Public;

use App\Enums\MediaType;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicExhibitionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'contract_id' => $this->id,
            'contract_code' => $this->code,
            'start_date' => $this->start_date->toDateString(),
            'end_date' => $this->end_date->toDateString(),
            'enterprise' => [
                'id' => $this->enterprise->id,
                'name' => $this->enterprise->company_name,
                'logo' => $this->enterprise->logo_url ?? null,
            ],
            'space' => [
                'id' => $this->space->id,
                'name' => $this->space->name,
                'location' => $this->space->location,
                'zone' => $this->space->zone,
                'category' => $this->space->category->name ?? null,
                'description' => $this->space->description,
                'media' => $this->space->media
                    ->where('type', MediaType::PANORAMA)
                    ->values()
                    ->map(function ($media) {
                        $metadata = is_string($media->metadata)
                            ? json_decode($media->metadata, true)
                            : ($media->metadata ?? []);

                        // Gắn type: 'navigation' vào từng marker trong metadata nếu có
                        if (isset($metadata['markers']) && is_array($metadata['markers'])) {
                            foreach ($metadata['markers'] as &$marker) {
                                $marker['type'] = 'navigation';
                            }
                        }

                        return [
                            'id' => $media->id,
                            'type' => $media->type,
                            'url' => $media->url,
                            'panorama_id' => $metadata['extra']['panoramaId'] ?? $media->id,
                            'metadata' => $metadata,
                        ];
                    }),
            ],

            'products' => $this->spaceProducts->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'product',
                    'yaw' => $item->position_metadata['yaw'],
                    'pitch' => $item->position_metadata['pitch'],
                    'panorama_id' => $item->position_metadata['panoramaId'] ?? null,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'image' => $item->product->images,
                        'price' => $item->product->price,
                        'description' => $item->product->description,
                    ]
                ];
            })
        ];
    }
}