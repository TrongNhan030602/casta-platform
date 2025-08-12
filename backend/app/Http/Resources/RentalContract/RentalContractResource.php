<?php
namespace App\Http\Resources\RentalContract;

use App\Http\Resources\User\UserCompactResource;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalContractResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id,
            'code' => $this->resource->code,
            'status' => $this->resource->status?->value,
            'approved_at' => $this->resource->approved_at,
            'creator' => new UserCompactResource($this->whenLoaded('creator')),
            'start_date' => $this->resource->start_date,
            'end_date' => $this->resource->end_date,
            'total_cost' => $this->resource->total_cost,
            'additional_cost' => $this->resource->additional_cost,
            'cancel_reason' => $this->resource->cancel_reason,
            'extend_requested_at' => $this->resource->extend_requested_at,

            'space' => $this->resource->space ? [
                'id' => $this->resource->space->id,
                'name' => $this->resource->space->name,
                'code' => $this->resource->space->code,
                'location' => $this->resource->space->location,
                'category' => $this->resource->space->category?->name,


            ] : null,

            'enterprise' => $this->resource->enterprise ? [
                'id' => $this->resource->enterprise->id,
                'name' => $this->resource->enterprise->company_name,
                'email' => $this->resource->enterprise->email,
                'phone' => $this->resource->enterprise->phone,
                'representative' => $this->resource->enterprise->representative,
                'reviewed_by' => $this->resource->enterprise->reviewer?->name,
            ] : null,

            'contract_reviewer' => $this->resource->reviewer?->name,
            'has_extend_request' => !is_null($this->resource->extend_requested_at),

        ];
    }
}