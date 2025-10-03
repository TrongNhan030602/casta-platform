<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'customer_name' => $this->customer->name ?? null,
            'total_amount' => $this->total_amount,
            'shipping_fee_total' => $this->shipping_fee_total,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'payment_status' => $this->payment_status->value,
            'payment_method' => $this->payment_method?->value,
            'note' => $this->note,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'sub_orders' => SubOrderResource::collection($this->subOrders),
            'transactions' => TransactionResource::collection($this->transactions),

        ];
    }
}