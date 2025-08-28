import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ServiceForm from "./components/ServiceForm";
import Button from "@/components/common/Button";
import {
  getServiceById,
  updateService,
} from "@/services/admin/servicesService";
import { uploadMedia, attachMedia } from "@/services/admin/mediaService";
import { getStorageUrl } from "@/utils/getStorageUrl";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const ServiceEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Fetch chi tiết dịch vụ
  const { data: serviceDetail, isLoading: isFetching } = useQuery({
    queryKey: ["serviceDetail", id],
    queryFn: () => getServiceById(id).then((res) => res.data?.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      // 1️⃣ Phân loại media: cũ và mới
      const existingIds = [];
      const newFiles = [];
      (formData.media || []).forEach((item) => {
        if (!item) return;
        if (item.id) existingIds.push(Number(item.id));
        else if (item.file) newFiles.push(item.file);
      });

      // 2️⃣ Upload media mới
      const uploadedIds = (
        await Promise.all(
          newFiles.map(async (file) => {
            if (!file) return null;
            const res = await uploadMedia(file);
            return res?.data?.data?.id || null;
          })
        )
      ).filter(Boolean);

      // 3️⃣ Merge tất cả media IDs
      const allMediaIds = [...existingIds, ...uploadedIds].filter(Boolean);

      // 4️⃣ Chuẩn payload update service (không cần featured_media_id)
      const payload = {
        name: formData.name,
        slug: formData.slug || undefined,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        summary: formData.summary || null,
        content: formData.content || null,
        price: formData.price ? Number(formData.price) : null,
        currency: formData.currency || "VND",
        duration_minutes: formData.duration_minutes
          ? Number(formData.duration_minutes)
          : null,
        features: formData.features || [],
        tags: (formData.tags || [])
          .map((t) => Number(t?.value ?? t))
          .filter(Boolean),
        status: formData.status,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
      };

      // 5️⃣ Cập nhật dịch vụ
      const res = await updateService(id, payload);
      if (!res?.data?.data?.id) throw new Error("Không lấy được ID dịch vụ");

      // 6️⃣ Sync media với backend (role: gallery)
      if (allMediaIds.length > 0) {
        await attachMedia({
          type: "service",
          id: id,
          media_ids: allMediaIds,
          role: "gallery",
        });
      }

      toast.success("Cập nhật dịch vụ thành công!");
      queryClient.invalidateQueries(["serviceList"]);
      queryClient.invalidateQueries(["serviceDetail", id]);

      navigate("/admin/services");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật dịch vụ:", err);
      const res = err.response?.data;
      if (res?.errors) {
        Object.entries(res.errors).forEach(([field, messages]) =>
          toast.error(`${field}: ${messages[0]}`)
        );
      } else {
        toast.error("Không thể cập nhật dịch vụ");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) return <LoadingSpinner text="Đang tải dữ liệu" />;
  if (!serviceDetail)
    return <p className="text-center text-muted">Dịch vụ không tồn tại</p>;

  // Map media để hiển thị đúng trong MediaSelector
  const mediaItems =
    serviceDetail.media?.map((m) => ({
      id: m.id,
      url: getStorageUrl(m.path),
      meta: m.meta || {},
    })) || [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">Chỉnh sửa dịch vụ</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <ServiceForm
        defaultValues={{
          status: serviceDetail.status || "draft",
          name: serviceDetail.name || "",
          slug: serviceDetail.slug || "",
          category_id: serviceDetail.category?.id ?? "",
          summary: serviceDetail.summary || "",
          content: serviceDetail.content || "",
          price: serviceDetail.price || "",
          currency: serviceDetail.currency || "VND",
          duration_minutes: serviceDetail.duration_minutes || "",
          features: serviceDetail.features || [],
          media: mediaItems,
          tags: (serviceDetail.tags || []).map((t) => ({
            id: t.id,
            value: t.id,
            label: t.name,
          })),

          meta_title: serviceDetail.meta_title || "",
          meta_description: serviceDetail.meta_description || "",
        }}
        isEdit
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default ServiceEditPage;
