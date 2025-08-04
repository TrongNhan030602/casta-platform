import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getEnterpriseProductDetail,
  updateEnterpriseProduct,
  getProductCategoryTree,
} from "@/services/enterprise/productService";

import flattenCategoryTree from "@/utils/flattenCategoryTree";
import ProductForm from "./components/ProductForm";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
const ProductEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          getEnterpriseProductDetail(id),
          getProductCategoryTree(),
        ]);

        const productData = productRes.data?.data;
        const categories = flattenCategoryTree(categoryRes.data?.data || []);

        // ⚠️ Ensure tags are array if backend returns JSON string
        const parsedTags =
          typeof productData.tags === "string"
            ? JSON.parse(productData.tags)
            : productData.tags;

        setDefaultValues({
          ...productData,
          category_id: String(productData.category?.id),
          tags: parsedTags,
        });

        setCategoryOptions(categories);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        toast.error("Không thể tải dữ liệu sản phẩm");
        navigate("/enterprise/products");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await updateEnterpriseProduct(id, data);
      toast.success("Cập nhật sản phẩm thành công");
      navigate("/enterprise/products");
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm:", err);
      const msg =
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!defaultValues) return <LoadingSpinner text="Đang tải dữ liệu" />;

  return (
    <div className="product-edit-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Chỉnh sửa sản phẩm</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/enterprise/products")}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        categoryOptions={categoryOptions}
        loading={loading}
        defaultValues={defaultValues}
        mode="update"
      />
    </div>
  );
};

export default ProductEditPage;
