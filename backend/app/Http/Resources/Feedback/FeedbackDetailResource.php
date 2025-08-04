<?php

namespace App\Http\Resources\Feedback;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'target_id' => $this->target_id,
            'target_name' => $this->target?->name ?? null,
            'target_detail' => $this->formatTarget(), // 👈 Thêm dòng này
            'content' => $this->content,
            'rating' => $this->rating,
            'status' => $this->status->value,
            'response' => $this->response,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
    private function formatTarget(): ?array
    {
        $target = $this->target;

        if (!$target)
            return null;

        return match ($this->type->value) {
            'space' => [
                'id' => $target->id,
                'name' => $target->name,
                'location' => $target->location,
                'zone' => $target->zone,
                'status' => $target->status->value,
            ],
            'product' => [
                'id' => $target->id,
                'name' => $target->name,
                'price' => $target->price,
                'stock' => $target->stock,
                'status' => $target->status->value,
            ],
            'enterprise' => [
                'id' => $target->id,
                'company_name' => $target->company_name,
                'representative' => $target->representative,
                'phone' => $target->phone,
                'email' => $target->email,
                'status' => $target->status->value,
            ],
            default => null,
        };
    }

}