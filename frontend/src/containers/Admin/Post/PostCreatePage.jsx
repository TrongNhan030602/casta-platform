// PostCreatePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

import PostForm from "./components/PostForm";
import Button from "@/components/common/Button";
import { createPost } from "@/services/admin/postsService";
import { uploadMedia, attachMedia } from "@/services/admin/mediaService";

const PostCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const formatDateTime = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(
      dt.getDate()
    )} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      // 1️⃣ Upload tất cả gallery song song
      const galleryIds = await Promise.all(
        (formData.gallery || []).map(async (item) => {
          if (item.file) {
            const res = await uploadMedia(item.file);
            return res?.data?.data?.id ?? null;
          }
          if (item.id != null) return Number(item.id);
          return null;
        })
      ).then((ids) => ids.filter(Boolean)); // lọc null/undefined

      // 2️⃣ Chuẩn payload tạo post
      const payload = {
        type: formData.type,
        title: formData.title,
        slug: formData.slug || undefined,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        summary: formData.summary || null,
        content: formData.content || null,
        tags: formData.tags,
        status: formData.status,
        is_sticky: formData.is_sticky ? 1 : 0,
        published_at: formatDateTime(formData.published_at),
        author_id: formData.author_id ? Number(formData.author_id) : null,
        event_location: formData.event_location || null,
        event_start: formatDateTime(formData.event_start),
        event_end: formatDateTime(formData.event_end),
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
      };

      // 3️⃣ Tạo post
      const res = await createPost(payload);
      const postId = res?.data?.data?.id;
      if (!postId) throw new Error("Không lấy được ID post mới");

      // 4️⃣ Gán media vào post nếu có
      if (galleryIds.length > 0) {
        await attachMedia({
          type: "post",
          id: postId,
          media_ids: galleryIds,
          role: "gallery",
        });
      }

      toast.success("Bài viết đã được tạo thành công!");
      queryClient.invalidateQueries(["postList"]);
      navigate("/admin/posts");
    } catch (err) {
      console.error("❌ Lỗi khi tạo bài viết:", err);
      const res = err.response?.data;
      if (res?.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          toast.error(`${field}: ${messages[0]}`);
        });
      } else {
        toast.error("Không thể tạo bài viết");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">Tạo bài viết</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/posts")}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <PostForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default PostCreatePage;
