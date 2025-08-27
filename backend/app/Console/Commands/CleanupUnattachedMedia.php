<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Media;
use Illuminate\Support\Facades\Storage;

class CleanupUnattachedMedia extends Command
{
    protected $signature = 'media:cleanup {--days=1 : Xóa media chưa gán cũ hơn bao nhiêu ngày}';
    protected $description = 'Xóa các media chưa gán cho model nào (vĩnh viễn)';

    public function handle()
    {
        $days = (int) $this->option('days');

        $this->info("Tìm media chưa gán, cũ hơn $days ngày...");

        // Lấy cả media soft deleted
        $mediaList = Media::withTrashed()
            ->doesntHave('posts')
            ->doesntHave('services')
            ->where('created_at', '<=', now()->subDays($days))
            ->get();

        $count = $mediaList->count();
        $this->info("Tìm thấy $count media cần xóa.");

        foreach ($mediaList as $media) {
            // Xóa file vật lý nếu tồn tại
            if (Storage::disk($media->disk)->exists($media->path)) {
                $this->info("Xóa file: {$media->path}");
                Storage::disk($media->disk)->delete($media->path);
            } else {
                $this->warn("File không tồn tại: {$media->path}");
            }

            // Xóa vĩnh viễn record, tự động dọn pivot table
            $media->forceDelete();
        }

        $this->info('Đã xong! Tất cả media chưa gán đã bị xóa vĩnh viễn.');
        return 0;
    }
}