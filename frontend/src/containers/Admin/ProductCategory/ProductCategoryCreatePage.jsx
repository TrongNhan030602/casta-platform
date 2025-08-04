// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ProductCategoryForm from "./components/ProductCategoryForm";
import Button from "@/components/common/Button";

import { createCategory } from "@/services/admin/productCategoryService";

const ProductCategoryCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data, { setError }) => {
    try {
      setLoading(true);
      await createCategory(data);
      toast.success("Tạo danh mục thành công");
      navigate("/admin/product-categories");
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors) {
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
        <h3 className="page-title">Tạo danh mục sản phẩm</h3>
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
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default ProductCategoryCreatePage;
