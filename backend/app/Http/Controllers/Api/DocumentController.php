<?php

namespace App\Http\Controllers\Api;

use App\Models\Enterprise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DocumentController extends Controller
{
    use AuthorizesRequests;

    public function viewDocument(Request $request, Enterprise $enterprise, $filename)
    {
        $this->authorize('view', $enterprise);

        // Tìm file theo tên trong danh sách documents
        $matchedDoc = collect($enterprise->documents ?? [])
            ->first(function ($doc) use ($filename) {
                return is_array($doc) && basename($doc['path']) === $filename;
            });

        if (!$matchedDoc || !Storage::disk('private')->exists($matchedDoc['path'])) {
            abort(404, 'Không tìm thấy tài liệu.');
        }

        return response()->file(storage_path("app/private/{$matchedDoc['path']}"));
    }
}