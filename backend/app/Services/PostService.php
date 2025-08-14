<?php
namespace App\Services;

use App\Interfaces\PostInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PostService
{
    protected PostInterface $repo;

    public function __construct(PostInterface $repo)
    {
        $this->repo = $repo;
    }

    public function publicSearch(array $filters): LengthAwarePaginator
    {
        return $this->repo->publicSearch($filters);
    }

    public function find(int $id): Post
    {
        return $this->repo->find($id);
    }

    public function store(array $data): Post
    {
        $userId = Auth::id();
        $data['created_by'] = $userId;
        $data['updated_by'] = $userId;

        // Tạo slug duy nhất nếu chưa có hoặc title thay đổi
        if (empty($data['slug']) && !empty($data['title'])) {
            $data['slug'] = Post::makeSlug($data['title']);
        }



        return $this->repo->store($data);
    }

    public function update(int $id, array $data): Post
    {
        $data['updated_by'] = Auth::id();

        $post = $this->repo->find($id);
        if (!$post) {
            throw new ModelNotFoundException("Post with ID {$id} not found.");
        }

        // Chỉ tạo slug mới khi title có thay đổi so với bản ghi hiện tại
        if (isset($data['title']) && $data['title'] !== $post->title) {
            $data['slug'] = Post::makeSlug($data['title']);
        }

        return $this->repo->update($id, $data);
    }


    public function delete(int $id, bool $cascade = false): bool
    {
        return $this->repo->delete($id, $cascade);
    }

    public function restore(int $id): bool
    {
        return $this->repo->restore($id);
    }

    public function forceDelete(int $id, bool $cascade = false): bool
    {
        return $this->repo->forceDelete($id, $cascade);
    }


}