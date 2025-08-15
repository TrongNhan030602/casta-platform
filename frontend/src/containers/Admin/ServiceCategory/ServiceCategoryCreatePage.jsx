import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

import ServiceCategoryForm from "./components/ServiceCategoryForm";
import Button from "@/components/common/Button";
import { createServiceCategory } from "@/services/admin/serviceCategoriesService";

const ServiceCategoryCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (data, { setError, reset, setIsSlugEdited }) => {
    try {
      setLoading(true);
      await createServiceCategory(data);

      queryClient.invalidateQueries(["serviceCategoryTree"]);

      toast.success("Tạo danh mục thành công");
      reset();
      setIsSlugEdited?.(false);
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors && setError) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages[0] });
        });
      } else {
        toast.error("Không thể tạo danh mục");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">Tạo danh mục dịch vụ</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/services-categories")}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <ServiceCategoryForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default ServiceCategoryCreatePage;
