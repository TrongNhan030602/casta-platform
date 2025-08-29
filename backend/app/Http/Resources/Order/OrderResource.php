<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer' => $this->customer?->name,
            'status' => $this->status->value, // enum string
            'total_price' => $this->total_price,
            'discount' => $this->discount,
            'final_price' => $this->final_price,

            // ✅ bổ sung payment
            'payment_status' => $this->payment_status->value,
            'payment_method' => $this->payment_method->value,

            'shipping_phone' => $this->shipping_phone,
            'shipping_address' => $this->shipping_address,
            'note' => $this->note,

            // ✅ items
            'items' => $this->items->map(fn($item) => [
                'product_id' => $item->product_id,
                'name' => $item->product->name,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'total_price' => $item->total_price,
            ]),

            // ✅ optionally trả histories
            'histories' => $this->whenLoaded(
                'histories',
                fn() =>
                $this->histories->map(fn($h) => [
                    'status' => $h->status,
                    'note' => $h->note,
                    'changed_by' => $h->user?->name,
                    'created_at' => $h->created_at->toDateTimeString(),
                ])
            ),

            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}