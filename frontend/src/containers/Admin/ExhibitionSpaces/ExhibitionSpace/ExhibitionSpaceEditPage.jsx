import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getExhibitionSpaceById,
  updateExhibitionSpace,
  getExhibitionSpaceCategoryTree,
} from "@/services/admin/exhibitionSpaceService";
import flattenCategoryTree from "@/utils/flattenCategoryTree";
import ExhibitionSpaceForm from "./components/ExhibitionSpaceForm";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const ExhibitionSpaceEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [exhibitionSpace, setExhibitionSpace] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [spaceRes, categoryRes] = await Promise.all([
          getExhibitionSpaceById(id),
          getExhibitionSpaceCategoryTree(),
        ]);

        setExhibitionSpace(spaceRes.data?.data);
        const flattened = flattenCategoryTree(categoryRes.data?.data || []);
        setCategoryOptions(flattened);
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu");
        navigate("/admin/exhibition-spaces");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await updateExhibitionSpace(id, data);
      toast.success("Cập nhật không gian trưng bày thành công");
      navigate("/admin/exhibition-spaces");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !exhibitionSpace) {
    return <LoadingSpinner text="Đang tải dữ liệu..." />;
  }

  return (
    <div className="exhibition-space-edit-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Chỉnh sửa không gian trưng bày</h2>
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
        defaultValues={exhibitionSpace}
      />
    </div>
  );
};

export default ExhibitionSpaceEditPage;
