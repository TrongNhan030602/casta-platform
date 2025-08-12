<?php
namespace App\Http\Resources\Enterprise;

use Illuminate\Http\Resources\Json\JsonResource;

class EnterpriseResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'company_name' => $this->company_name,
            'tax_code' => $this->tax_code,
            'business_field' => $this->business_field,
            'district' => $this->district,
            'address' => $this->address,
            'representative' => $this->representative,
            'phone' => $this->phone,
            'email' => $this->email,
            'logo_url' => $this->logo_url,
            'website' => $this->website,
            'status' => $this->status,
            'reviewed_by' => $this->reviewed_by,
            'approved_at' => $this->approved_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'documents' => $this->documents ?? [],
            // Optional
            'user' => $this->whenLoaded('user'),
            'reviewer' => $this->whenLoaded('reviewer'),
            'public_slug' => optional($this->whenLoaded('publicContract'))->public_slug,

        ];
    }
}