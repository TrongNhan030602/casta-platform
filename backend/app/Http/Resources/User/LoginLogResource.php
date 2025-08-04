<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            'ip' => $this->ip_address,
            'device' => $this->user_agent,
            'logged_at' => $this->created_at->toISOString(),
        ];
    }
}