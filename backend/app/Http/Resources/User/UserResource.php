<?php
namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'status' => $this->status,
            'email_verified_at' => $this->email_verified_at,
            'reactivation_requested' => $this->reactivation_requested,
            'reactivation_requested_at' => $this->reactivation_requested_at,
            'enterprise_id' => $this->enterprise_id,

            // Thông tin khách hàng
            'customer' => $this->whenLoaded('customer', fn() => [
                'name' => $this->customer->name,
                'phone' => $this->customer->phone,
                'address' => $this->customer->address,
                'avatar_url' => $this->customer->avatar_url,
                'gender' => $this->customer->gender,
                'dob' => $this->customer->dob,
            ]),

            // Thông tin doanh nghiệp đại diện
            // Thông tin doanh nghiệp đại diện
            'enterprise' => $this->whenLoaded('enterprise', fn() => [
                'id' => $this->enterprise->id,
                'company_name' => $this->enterprise->company_name,
                'tax_code' => $this->enterprise->tax_code,
                'business_field' => $this->enterprise->business_field,
                'district' => $this->enterprise->district,
                'address' => $this->enterprise->address,
                'representative' => $this->enterprise->representative,
                'phone' => $this->enterprise->phone,
                'email' => $this->enterprise->email,
                'website' => $this->enterprise->website,
                'logo_url' => $this->enterprise->logo_url,
                'documents' => $this->enterprise->documents,
                'status' => $this->enterprise->status,
                'approved_at' => $this->enterprise->approved_at,
                'reviewed_by' => $this->enterprise->reviewed_by,

                // Optional: load cả tên người duyệt (nếu muốn show lên giao diện)
                'reviewer' => $this->enterprise->reviewer
                    ? [
                        'id' => $this->enterprise->reviewer->id,
                        'name' => $this->enterprise->reviewer->name,
                        'email' => $this->enterprise->reviewer->email,
                    ]
                    : null,
            ]),


            // Doanh nghiệp mà nhân viên thuộc về
            'enterpriseBelongingTo' => $this->whenLoaded('enterpriseBelongingTo', fn() => [
                'id' => $this->enterpriseBelongingTo->id,
                'company_name' => $this->enterpriseBelongingTo->company_name,
            ]),

            // Các lần đăng nhập gần nhất
            'login_logs' => $this->whenLoaded('loginLogs', fn() => $this->loginLogs->map(function ($log) {
                return [
                    'ip_address' => $log->ip_address,
                    'user_agent' => $log->user_agent,
                    'created_at' => $log->created_at,
                ];
            })),

            // Cảnh báo vi phạm
            'violations' => $this->whenLoaded('violations', fn() => $this->violations->map(function ($violation) {
                return [
                    'reason' => $violation->reason,
                    'details' => $violation->details,
                    'created_at' => $violation->created_at,
                ];
            })),
        ];
    }
}