import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import ServiceCategoryForm from "./components/ServiceCategoryForm";
import Button from "@/components/common/Button";
import {
  getServiceCategoryById,
  updateServiceCategory,
} from "@/services/admin/serviceCategoriesService";

const ServiceCategoryEditPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getServiceCategoryById(id);
        setDefaultValues(res.data?.data || {});
      } catch {
        toast.error("Không thể tải thông tin danh mục");
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (data, { setError }) => {
    try {
      setLoading(true);
      await updateServiceCategory(id, data);
      toast.success("Cập nhật danh mục thành công");
      queryClient.invalidateQueries(["serviceCategoryTree"]);
      navigate("/admin/services-categories");
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages[0] });
        });
      } else {
        toast.error("Không thể cập nhật danh mục");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!defaultValues) return <LoadingSpinner text="Đang tải dữ liệu..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">Cập nhật danh mục dịch vụ</h3>
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
        defaultValues={defaultValues}
        isEdit
        categoryId={Number(id)}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default ServiceCategoryEditPage;
