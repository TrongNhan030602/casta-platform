<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Resources\Json\JsonResource;

class SubOrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'enterprise_id' => $this->enterprise_id,
            'enterprise_name' => $this->enterprise->company_name ?? null,
            'sub_total' => $this->sub_total,
            'shipping_fee' => $this->shipping_fee,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'tracking_number' => $this->tracking_number,
            'note' => $this->note,
            'items' => OrderItemResource::collection($this->items),
            'deleted_at' => $this->deleted_at,

        ];
    }
}