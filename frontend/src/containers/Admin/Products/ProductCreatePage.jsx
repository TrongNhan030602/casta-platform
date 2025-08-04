import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { adminCreateProduct } from "@/services/admin/productService";
import { useProductCategoryTree } from "@/hooks/useProductCategoryTree";
import { useSimpleApprovedEnterprises } from "@/hooks/useSimpleApprovedEnterprises";

import ProductForm from "./components/ProductForm";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Lấy danh mục sản phẩm
  const {
    data: categoryOptions = [],
    isLoading: categoryLoading,
    error: categoryError,
  } = useProductCategoryTree();

  // Lấy doanh nghiệp đã duyệt (dùng react-query hook)
  const {
    data: enterpriseOptions = [],
    isLoading: enterpriseLoading,
    error: enterpriseError,
  } = useSimpleApprovedEnterprises();

  // Thông báo lỗi nếu có
  useEffect(() => {
    if (categoryError) {
      toast.error("Không thể tải danh mục sản phẩm");
    }
    if (enterpriseError) {
      toast.error("Không thể tải danh sách doanh nghiệp");
    }
  }, [categoryError, enterpriseError]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await adminCreateProduct(data);
      toast.success("Tạo sản phẩm thành công");
      navigate("/admin/products");
    } catch (err) {
      console.error("Lỗi tạo sản phẩm:", err);
      toast.error(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (categoryLoading || enterpriseLoading) {
    return <LoadingSpinner text="Đang tải dữ liệu" />;
  }

  return (
    <div className="product-create-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Tạo mới sản phẩm</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/products")}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        categoryOptions={categoryOptions}
        enterpriseOptions={enterpriseOptions}
        loading={loading}
        mode="create"
      />
    </div>
  );
};

export default ProductCreatePage;
