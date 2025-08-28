// @/pages/admin/posts/PostEditPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import PostForm from "./components/PostForm";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getPostById, updatePost } from "@/services/admin/postsService";
import { uploadMedia, attachMedia } from "@/services/admin/mediaService";
import { getStorageUrl } from "@/utils/getStorageUrl";

const PostEditPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Fetch chi tiết bài viết
  const { data: postDetail, isLoading: isFetching } = useQuery({
    queryKey: ["postDetail", postId],
    queryFn: () => getPostById(postId).then((res) => res.data?.data),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
  });

  const formatDateTime = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(
      dt.getDate()
    )} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
  };

  const handleSubmit = async (formData, { setIsSlugEdited }) => {
    try {
      setLoading(true);

      // 1️⃣ Tách media cũ và file mới từ MediaSelector
      const existingIds = [];
      const newFiles = [];
      (formData.media || []).forEach((item) => {
        if (!item) return;
        if (item.id) existingIds.push(Number(item.id));
        else if (item.file) newFiles.push(item.file);
      });

      // 2️⃣ Upload media mới song song
      const uploadedIds = (
        await Promise.all(
          newFiles.map(async (file) => {
            if (!file) return null;
            const res = await uploadMedia(file);
            return res?.data?.data?.id || null;
          })
        )
      ).filter(Boolean);

      // 3️⃣ Merge tất cả media muốn giữ
      const allMediaIds = [...existingIds, ...uploadedIds].filter(Boolean);

      // 4️⃣ Chuẩn payload update post (không cần gallery)
      const payload = {
        type: formData.type,
        title: formData.title,
        slug: formData.slug || undefined,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        summary: formData.summary || null,
        content: formData.content || null,
        tags: (formData.tags || [])
          .map((t) => Number(t?.id ?? t?.value ?? t))
          .filter(Boolean),
        status: formData.status,
        is_sticky: formData.is_sticky ? 1 : 0,
        published_at: formatDateTime(formData.published_at),
        event_location: formData.event_location || null,
        event_start: formatDateTime(formData.event_start),
        event_end: formatDateTime(formData.event_end),
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
      };

      // 5️⃣ Cập nhật bài viết
      const res = await updatePost(postId, payload);
      if (!res?.data?.data?.id) throw new Error("Không lấy được ID post");

      // 6️⃣ Sync media với BE (BE dùng sync())
      if (allMediaIds.length > 0) {
        await attachMedia({
          type: "post",
          id: postId,
          media_ids: allMediaIds,
          role: "gallery",
        });
      }

      toast.success("Cập nhật bài viết thành công!");
      queryClient.invalidateQueries(["postList"]);
      queryClient.invalidateQueries(["postDetail", postId]);
      setIsSlugEdited?.(false);

      navigate("/admin/posts");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật bài viết:", err);
      const res = err.response?.data;
      if (res?.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          toast.error(`${field}: ${messages[0]}`);
        });
      } else {
        toast.error("Không thể cập nhật bài viết");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) return <LoadingSpinner text="Đang tải dữ liệu" />;
  if (!postDetail)
    return <p className="text-center text-muted">Bài viết không tồn tại</p>;

  // Map media để hiển thị đúng trong MediaSelector
  const mediaItems =
    postDetail.media?.map((m) => ({
      id: m.id,
      url: getStorageUrl(m.path),
      meta: m.meta || [],
    })) || [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">Chỉnh sửa bài viết</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <PostForm
        defaultValues={{
          type: postDetail.type || "news",
          status: postDetail.status || "draft",
          title: postDetail.title || "",
          slug: postDetail.slug || "",
          category_id: postDetail.category?.id ?? "",
          summary: postDetail.summary || "",
          content: postDetail.content || "",
          media: mediaItems, // <-- media thay cho gallery
          tags: (postDetail.tags || []).map((t) => ({
            id: t.id,
            value: t.id,
            label: t.name,
          })),
          is_sticky: postDetail.is_sticky || false,
          published_at: postDetail.published_at || "",
          event_location: postDetail.event_location || "",
          event_start: postDetail.event_start || "",
          event_end: postDetail.event_end || "",
          meta_title: postDetail.meta_title || "",
          meta_description: postDetail.meta_description || "",
        }}
        isEdit
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default PostEditPage;
