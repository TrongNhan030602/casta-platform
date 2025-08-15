// NewsCategoryCreatePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

import NewsCategoryForm from "./components/NewsCategoryForm";
import Button from "@/components/common/Button";
import { createNewsCategory } from "@/services/admin/newsCategoriesService";

const NewsCategoryCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (data, { setError, reset, setIsSlugEdited }) => {
    try {
      setLoading(true);
      await createNewsCategory(data);

      // Chỉ invalidate query ở đây
      queryClient.invalidateQueries(["newsCategoryTree"]);

      toast.success("Tạo danh mục thành công");

      // Reset form + slug flag
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
        <h3 className="page-title">Tạo danh mục tin tức</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/news-categories")}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <NewsCategoryForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default NewsCategoryCreatePage;
