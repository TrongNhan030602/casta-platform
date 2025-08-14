<?php
namespace App\Repositories;

use App\Models\Post;
use App\Enums\PostType;
use App\Enums\PostStatus;
use App\Interfaces\PostInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PostRepository implements PostInterface
{
    public function publicSearch(array $filters): LengthAwarePaginator
    {
        $query = Post::query();

        $deletedOptions = ['only', 'all', 'none'];
        $deleted = $filters['deleted'] ?? 'none';
        if (!in_array($deleted, $deletedOptions)) {
            $deleted = 'none';
        }

        switch ($deleted) {
            case 'only':
                $query->onlyTrashed();
                break;
            case 'all':
                $query->withTrashed();
                break;
            case 'none':
            default:
                // Không lấy soft deleted
                break;
        }

        if (!empty($filters['type']) && in_array($filters['type'], PostType::values())) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['status']) && in_array($filters['status'], PostStatus::values())) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('published_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('published_at', '<=', $filters['date_to']);
        }

        if (!empty($filters['tags'])) {
            $tagIds = array_filter(explode(',', $filters['tags']));
            if (!empty($tagIds)) {
                $query->whereHas('tags', function ($q) use ($tagIds) {
                    $q->whereIn('tags.id', $tagIds);
                });
            }
        }

        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                    ->orWhere('content', 'like', "%{$keyword}%");
            });
        }

        $validSortBy = ['id', 'published_at', 'title', 'created_at'];
        $sortBy = in_array($filters['sort_by'] ?? '', $validSortBy) ? $filters['sort_by'] : 'published_at';
        $sortOrder = in_array(strtolower($filters['sort_order'] ?? ''), ['asc', 'desc']) ? $filters['sort_order'] : 'desc';

        $query->orderBy($sortBy, $sortOrder);

        $query->with(['category', 'tags', 'media', 'author']);

        $perPage = $filters['per_page'] ?? 15;

        return $query->paginate($perPage);
    }



    public function find(int $id): Post
    {
        return Post::withTrashed()
            ->with(['category', 'tags', 'media', 'author'])
            ->findOrFail($id);
    }


    public function store(array $data): Post
    {
        return DB::transaction(function () use ($data) {
            $tags = $data['tags'] ?? [];
            unset($data['tags']);

            $post = Post::create($data);

            if (!empty($tags)) {
                // Đồng bộ tag (mảng id)
                $post->tags()->sync($tags);
                // Cập nhật cache tag dạng chuỗi
                $post->tags_cached = $post->tags->pluck('name')->implode(', ');
                $post->save();
            }
            $post->load(['category', 'tags', 'author', 'media']);
            return $post;
        });
    }

    public function update(int $id, array $data): Post
    {
        return DB::transaction(function () use ($id, $data) {
            $post = $this->find($id);

            $tags = $data['tags'] ?? null;
            unset($data['tags']);

            $post->update($data);

            if (is_array($tags)) {
                $post->tags()->sync($tags);
                $post->tags_cached = $post->tags->pluck('name')->implode(', ');
                $post->save();
            }

            $post->load(['category', 'tags', 'author', 'media']);

            return $post;
        });
    }



    public function delete(int $id, bool $cascade = false): bool
    {
        $post = $this->find($id);
        return $post->delete();
    }

    public function restore(int $id): bool
    {
        $post = Post::withTrashed()->findOrFail($id);
        return $post->restore();
    }

    public function forceDelete(int $id, bool $cascade = false): bool
    {
        $post = Post::withTrashed()->findOrFail($id);
        return $post->forceDelete();
    }
}