<?php
namespace App\Interfaces;

use App\Models\Order;
use App\Enums\OrderStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface OrderInterface
{
    public function search(array $filters): LengthAwarePaginator;
    public function find(int $id): Order;
    public function store(array $data): Order;
    public function updateStatus(Order $order, OrderStatus $status, int $changedBy, ?string $note = null): Order;
}