import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createExhibitionSpace,
  getExhibitionSpaceCategoryTree,
} from "@/services/admin/exhibitionSpaceService";
import flattenCategoryTree from "@/utils/flattenCategoryTree";
import ExhibitionSpaceForm from "./components/ExhibitionSpaceForm";
import Button from "@/components/common/Button";

const ExhibitionSpaceCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getExhibitionSpaceCategoryTree();
        const flattened = flattenCategoryTree(res.data?.data || []);
        setCategoryOptions(flattened);
      } catch (err) {
        console.error("🚀 ~ fetchCategories ~ err:", err);
        toast.error("Không thể tải danh mục không gian");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (data) => {
    if (!data.code || !data.name) {
      toast.error("Vui lòng nhập mã và tên không gian.");
      return;
    }

    try {
      setLoading(true);
      await createExhibitionSpace(data);
      toast.success("Tạo không gian trưng bày thành công");
      navigate("/admin/exhibition-spaces");
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exhibition-space-create-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Tạo mới không gian trưng bày</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/exhibition-spaces")}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <ExhibitionSpaceForm
        onSubmit={handleSubmit}
        categoryOptions={categoryOptions}
        loading={loading}
      />
    </div>
  );
};

export default ExhibitionSpaceCreatePage;
