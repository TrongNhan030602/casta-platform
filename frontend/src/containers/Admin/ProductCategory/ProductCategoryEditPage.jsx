// React
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Third-party
import { toast } from "react-toastify";

// Custom components
import ProductCategoryForm from "./components/ProductCategoryForm";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// Services
import {
  getCategoryById,
  updateCategory,
} from "@/services/admin/productCategoryService";

const ProductCategoryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [defaultValues, setDefaultValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      setFetching(true);
      try {
        const res = await getCategoryById(id);
        setDefaultValues(res.data.data || {});
      } catch (err) {
        console.error("Lỗi tải dữ liệu danh mục:", err);
        toast.error("Không thể tải dữ liệu danh mục");
        navigate("/admin/product-categories");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchCategory();
  }, [id, navigate]);

  const handleSubmit = async (data, { setError }) => {
    try {
      setLoading(true);
      await updateCategory(id, data);
      toast.success("Cập nhật danh mục thành công");
      navigate("/admin/product-categories");
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

  if (fetching) {
    return <LoadingSpinner text="Đang tải dữ liệu..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">Chỉnh sửa danh mục sản phẩm</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/product-categories")}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <ProductCategoryForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isEdit
        loading={loading}
      />
    </div>
  );
};

export default ProductCategoryEditPage;
