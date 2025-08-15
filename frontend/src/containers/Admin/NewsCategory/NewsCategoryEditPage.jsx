// NewsCategoryEditPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

import NewsCategoryForm from "./components/NewsCategoryForm";
import Button from "@/components/common/Button";
import {
  getNewsCategoryById,
  updateNewsCategory,
} from "@/services/admin/newsCategoriesService";

const NewsCategoryEditPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getNewsCategoryById(id);
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
      await updateNewsCategory(id, data);
      toast.success("Cập nhật danh mục thành công");
      queryClient.invalidateQueries(["newsCategoryTree"]);
      navigate("/admin/news-categories");
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

  if (!defaultValues) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">Cập nhật danh mục tin tức</h3>
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
        defaultValues={defaultValues}
        isEdit
        categoryId={Number(id)}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default NewsCategoryEditPage;
