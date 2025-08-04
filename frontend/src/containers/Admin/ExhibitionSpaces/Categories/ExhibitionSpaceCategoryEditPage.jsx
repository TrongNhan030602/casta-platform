import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ExhibitionSpaceCategoryForm from "./components/ExhibitionSpaceCategoryForm";
import {
  getExhibitionSpaceCategoryById,
  updateExhibitionSpaceCategory,
} from "@/services/admin/exhibitionSpaceService";
import Button from "@/components/common/Button";

const ExhibitionSpaceCategoryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getExhibitionSpaceCategoryById(id);
        const category = res.data?.data;
        console.log("🚀 ~ fetchCategory ~ category:", category);

        if (!category) throw new Error("Không tìm thấy danh mục");

        setInitialData({
          id: String(category.id), // Loại chính nó trong danh mục cha
          name: category.name,
          description: category.description || "",
          parent_id: category.parent_id ? String(category.parent_id) : "",
        });
      } catch (err) {
        console.log("🚀 ~ fetchCategory ~ err:", err);
        toast.error("Không thể tải danh mục");
        navigate("/admin/exhibition-space-categories");
      }
    };

    fetchCategory();
  }, [id, navigate]);

  const handleSubmit = async (data, { setError }) => {
    try {
      setIsLoading(true);
      await updateExhibitionSpaceCategory(id, data);
      toast.success("Cập nhật thành công");
      navigate("/admin/exhibition-space-categories");
    } catch (err) {
      if (err.response?.data?.errors) {
        Object.entries(err.response.data.errors).forEach(([field, messages]) =>
          setError(field, { type: "manual", message: messages[0] })
        );
      } else {
        toast.error(err.response?.data?.message || "Lỗi cập nhật");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="exhibition-space-category-edit-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Cập nhật danh mục</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/exhibition-space-categories")}
          disabled={isLoading}
        >
          ← Quay lại
        </Button>
      </div>

      {initialData && (
        <ExhibitionSpaceCategoryForm
          defaultValues={initialData}
          isEdit
          onSubmit={handleSubmit}
          loading={isLoading}
        />
      )}
    </div>
  );
};

export default ExhibitionSpaceCategoryEditPage;
