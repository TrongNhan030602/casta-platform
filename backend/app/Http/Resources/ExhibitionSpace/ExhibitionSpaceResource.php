<?php

namespace App\Http\Resources\ExhibitionSpace;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExhibitionSpaceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'location' => $this->location,
            'zone' => $this->zone,
            'size' => $this->size,
            'status' => $this->status?->value,
            'price' => $this->price,
            'description' => $this->description,
            'metadata' => $this->metadata,

            'category_id' => $this->category_id,
            'category_name' => $this->category?->name,

            // ✅ Trả danh sách media (nếu load)
            'media' => $this->whenLoaded('media', function () {
                return $this->media->map(fn($m) => [
                    'id' => $m->id,
                    'type' => $m->type?->value, // ✅ Tránh lỗi nếu enum null
                    'url' => $m->url,
                    'caption' => $m->caption,
                    'order' => $m->order,
                    'metadata' => $m->metadata,
                ]);
            }),

            // ✅ Trả thông tin doanh nghiệp đang thuê
            'current_enterprise' => $this->whenLoaded('approvedContracts', function () {
                return $this->approvedContracts->map(function ($contract) {
                    return [
                        'enterprise_id' => $contract->enterprise->id ?? null,
                        'company_name' => $contract->enterprise->company_name ?? null,
                        'approved_at' => $contract->approved_at,
                        'start_date' => $contract->start_date,
                        'end_date' => $contract->end_date,
                    ];
                });
            }),
        ];
    }
}