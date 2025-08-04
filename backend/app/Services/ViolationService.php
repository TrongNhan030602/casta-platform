<?php
namespace App\Services;

use App\Models\User;
use App\Models\Violation;
use App\Mail\ViolationWarningMail;
use Illuminate\Support\Facades\Mail;
use App\Interfaces\ViolationInterface;

class ViolationService
{
    protected ViolationInterface $violationRepository;

    public function __construct(ViolationInterface $violationRepository)
    {
        $this->violationRepository = $violationRepository;
    }

    public function warnUser(User $user, string $reason, ?string $details = null): Violation
    {
        $violation = $this->violationRepository->create([
            'user_id' => $user->id,
            'reason' => $reason,
            'details' => $details,
            'created_by' => auth()->id(),
        ]);

        Mail::to($user->email)->send(new ViolationWarningMail($user, $violation));

        return $violation;
    }

    public function listViolations(array $filters = [], int $perPage = 15)
    {
        return $this->violationRepository->getAll($filters, $perPage);
    }

    public function getUserViolations(int $userId): array
    {
        return $this->violationRepository->getByUserId($userId);
    }
    public function countViolationsByUser(int $userId): int
    {
        return $this->violationRepository->countByUserId($userId);
    }

    public function deleteViolation(int $id): bool
    {
        return $this->violationRepository->delete($id);
    }

}