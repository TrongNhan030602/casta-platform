import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAdminProductDetail,
  adminUpdateProduct,
} from "@/services/admin/productService";

import { useProductCategoryTree } from "@/hooks/useProductCategoryTree";
import { useSimpleApprovedEnterprises } from "@/hooks/useSimpleApprovedEnterprises";

import ProductForm from "./components/ProductForm";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const ProductEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);

  const {
    data: categoryOptions = [],
    isLoading: categoryLoading,
    error: categoryError,
  } = useProductCategoryTree();

  const {
    data: enterpriseOptions = [],
    isLoading: enterpriseLoading,
    error: enterpriseError,
  } = useSimpleApprovedEnterprises();

  useEffect(() => {
    if (categoryError) toast.error("Không thể tải danh mục sản phẩm");
  }, [categoryError]);

  useEffect(() => {
    if (enterpriseError) toast.error("Không thể tải danh sách doanh nghiệp");
  }, [enterpriseError]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRes = await getAdminProductDetail(id);
        const productData = productRes.data?.data;

        const parsedTags =
          typeof productData.tags === "string"
            ? JSON.parse(productData.tags)
            : productData.tags;

        setDefaultValues({
          ...productData,
          category_id: String(productData.category?.id || ""),
          enterprise_id: String(productData.enterprise?.id || ""),
          tags: parsedTags || [],
        });
      } catch (err) {
        console.error("Lỗi tải dữ liệu sản phẩm:", err);
        toast.error("Không thể tải dữ liệu sản phẩm");
        navigate("/admin/products");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await adminUpdateProduct(id, data);
      toast.success("Cập nhật sản phẩm thành công");
      navigate("/admin/products");
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm:", err);
      toast.error(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (categoryLoading || enterpriseLoading || !defaultValues)
    return <LoadingSpinner text="Đang tải dữ liệu" />;

  return (
    <div className="product-edit-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Chỉnh sửa sản phẩm</h2>
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
        defaultValues={defaultValues}
        mode="update"
      />
    </div>
  );
};

export default ProductEditPage;
