import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import TagForm from "./components/TagForm";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getTagById, updateTag } from "@/services/admin/tagsService";

const TagEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: tagDetail, isLoading: isFetching } = useQuery({
    queryKey: ["tagDetail", id],
    queryFn: () => getTagById(id).then((res) => res.data?.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await updateTag(id, formData);
      if (!res?.data?.data?.id) throw new Error("Không lấy được ID Tag");

      toast.success("Cập nhật Tag thành công!");
      queryClient.invalidateQueries(["tagList"]);
      queryClient.invalidateQueries(["tagDetail", id]);
      navigate("/admin/tags");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật Tag:", err);
      const res = err.response?.data;
      if (res?.errors) {
        Object.entries(res.errors).forEach(([field, messages]) =>
          toast.error(`${field}: ${messages[0]}`)
        );
      } else {
        toast.error("Không thể cập nhật Tag");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) return <LoadingSpinner text="Đang tải dữ liệu" />;
  if (!tagDetail)
    return <p className="text-center text-muted">Tag không tồn tại</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">Chỉnh sửa Tag</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <TagForm
        defaultValues={{
          name: tagDetail.name,
          slug: tagDetail.slug,
        }}
        isEdit
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default TagEditPage;
