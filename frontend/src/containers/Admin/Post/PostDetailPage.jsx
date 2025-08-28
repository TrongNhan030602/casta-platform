import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

import { getStorageUrl } from "@/utils/getStorageUrl";
import { getPostById } from "@/services/admin/postsService";
import { formatDateTime } from "@/utils/formatDateTime";

import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import "@/assets/styles/layout/admin/post/post-detail.css";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await getPostById(id);
        setPost(res.data?.data);
      } catch {
        toast.error("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <LoadingSpinner text="Đang tải dữ liệu" />;
  if (!post)
    return <p className="text-center text-muted"> Bài viết không tồn tại</p>;

  const mainImage = post.media?.length > 0 ? post.media[0] : null;

  return (
    <div className="post-detail container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="post-detail__title">{post.title}</h2>
        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/posts")}
          >
            <FaArrowLeft /> Quay lại
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
          >
            <FaEdit /> Chỉnh sửa
          </Button>
        </div>
      </div>

      {/* Meta */}
      <div className="post-detail__meta mb-3">
        <span className="me-3">Loại: {post.type}</span>
        <span className="me-3">Danh mục: {post.category?.name}</span>
        {post.type === "event" && (
          <>
            <span className="me-3">Địa điểm: {post.event_location}</span>
            <span className="me-3">
              Thời gian: {formatDateTime(post.event_start)} -{" "}
              {formatDateTime(post.event_end)}
            </span>
          </>
        )}
        <span className="me-3">Tác giả: {post.author?.name}</span>
        <span className="me-3">
          Ngày đăng: {formatDateTime(post.published_at)}
        </span>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="post-detail__tags mt-3">
          {post.tags.map((tag) => (
            <Badge
              key={tag.id}
              color="secondary"
              className="me-2"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Summary */}
      {post.summary && (
        <p className="post-detail__summary lead text-muted">{post.summary}</p>
      )}

      {/* Main Image */}
      {mainImage && (
        <div className="post-detail__image mb-4">
          <img
            className="w-100 rounded shadow-sm"
            src={getStorageUrl(mainImage.path)}
            alt={post.title}
          />
        </div>
      )}

      {/* Content */}
      <article
        className="post-detail__content mb-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default PostDetailPage;
