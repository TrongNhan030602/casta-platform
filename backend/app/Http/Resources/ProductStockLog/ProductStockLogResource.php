<?php

namespace App\Http\Resources\ProductStockLog;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductStockLogResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,

            'type' => $this->type->value,
            'type_label' => $this->type->label(), // nếu enum có hàm label()

            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'note' => $this->note,
            'stock_after' => $this->stock_after,
            'avg_cost_after' => $this->avg_cost_after,

            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}