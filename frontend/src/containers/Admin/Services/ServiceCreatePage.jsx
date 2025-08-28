import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

import ServiceForm from "./components/ServiceForm";
import Button from "@/components/common/Button";
import { createService } from "@/services/admin/servicesService";
import { uploadMedia, attachMedia } from "@/services/admin/mediaService";

const ServiceCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      // 1️⃣ Upload tất cả media song song
      const mediaIds = await Promise.all(
        (formData.media || []).map(async (item) => {
          if (item.file) {
            const res = await uploadMedia(item.file);
            return res?.data?.data?.id ?? null;
          }
          if (item.id != null) return Number(item.id);
          return null;
        })
      ).then((ids) => ids.filter(Boolean));

      // 2️⃣ Chuẩn payload tạo service (không cần featured_media_id riêng)
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
        features: formData.features || null,
        tags: (formData.tags || [])
          .map((t) => Number(t?.value ?? t))
          .filter(Boolean),
        status: formData.status || "draft",
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
      };

      // 3️⃣ Tạo service
      const res = await createService(payload);
      const serviceId = res?.data?.data?.id;
      if (!serviceId) throw new Error("Không lấy được ID dịch vụ mới");

      // 4️⃣ Gán tất cả media vào service (role: gallery)
      if (mediaIds.length > 0) {
        await attachMedia({
          type: "service",
          id: serviceId,
          media_ids: mediaIds,
          role: "gallery",
        });
      }

      toast.success("Dịch vụ đã được tạo thành công!");
      queryClient.invalidateQueries(["serviceList"]);
      navigate("/admin/services");
    } catch (err) {
      console.error("❌ Lỗi khi tạo dịch vụ:", err);
      const res = err.response?.data;
      if (res?.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          toast.error(`${field}: ${messages[0]}`);
        });
      } else {
        toast.error("Không thể tạo dịch vụ");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">Tạo dịch vụ</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/services")}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <ServiceForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default ServiceCreatePage;
