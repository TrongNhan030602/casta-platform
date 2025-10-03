<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\PaymentMethod;
use Illuminate\Validation\Rules\Enum;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Thêm policy nếu cần
    }

    public function rules(): array
    {
        return [
            'note' => ['nullable', 'string'],

            'status' => ['nullable', new Enum(OrderStatus::class)],
            'payment_status' => ['nullable', new Enum(PaymentStatus::class)],
            'payment_method' => ['nullable', new Enum(PaymentMethod::class)],

            // SubOrders
            'sub_orders' => ['required', 'array', 'min:1'],
            'sub_orders.*.enterprise_id' => ['required', 'exists:enterprises,id'],
            'sub_orders.*.shipping_fee' => ['required', 'numeric', 'min:0'],
            'sub_orders.*.status' => ['nullable', new Enum(\App\Enums\SubOrderStatus::class)],
            'sub_orders.*.tracking_number' => ['nullable', 'string'],
            'sub_orders.*.note' => ['nullable', 'string'],

            // Items
            'sub_orders.*.items' => ['required', 'array', 'min:1'],
            'sub_orders.*.items.*.product_id' => ['required', 'exists:products,id'],
            'sub_orders.*.items.*.quantity' => ['required', 'integer', 'min:1'],
            'sub_orders.*.items.*.price' => ['required', 'numeric', 'min:0'],
            'sub_orders.*.items.*.note' => ['nullable', 'string'],
        ];
    }
}