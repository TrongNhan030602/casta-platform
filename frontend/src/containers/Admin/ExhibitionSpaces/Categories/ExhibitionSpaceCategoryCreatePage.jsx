import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ExhibitionSpaceCategoryForm from "./components/ExhibitionSpaceCategoryForm";
import { createExhibitionSpaceCategory } from "@/services/admin/exhibitionSpaceService";
import Button from "@/components/common/Button";

const ExhibitionSpaceCategoryCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data, { setError }) => {
    try {
      setLoading(true);
      await createExhibitionSpaceCategory(data);
      toast.success("Tạo danh mục thành công");
      navigate("/admin/exhibition-space-categories");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        Object.entries(err.response.data.errors).forEach(([key, messages]) => {
          setError(key, { type: "manual", message: messages[0] });
        });
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exhibition-space-category-create-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Tạo danh mục không gian trưng bày</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/exhibition-space-categories")}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <ExhibitionSpaceCategoryForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default ExhibitionSpaceCategoryCreatePage;
