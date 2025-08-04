import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  createEnterpriseProduct,
  getProductCategoryTree,
} from "@/services/enterprise/productService";

import flattenCategoryTree from "@/utils/flattenCategoryTree";
import ProductForm from "./components/ProductForm";
import Button from "@/components/common/Button";

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getProductCategoryTree();
        const flattened = flattenCategoryTree(res.data?.data || []);
        setCategoryOptions(flattened);
      } catch (err) {
        console.error("Lỗi tải danh mục sản phẩm:", err);
        toast.error("Không thể tải danh mục sản phẩm");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await createEnterpriseProduct(data);
      toast.success("Tạo sản phẩm thành công");
      navigate("/enterprise/products");
    } catch (err) {
      console.error("Lỗi tạo sản phẩm:", err);
      const msg =
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-create-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Tạo mới sản phẩm</h2>
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
        mode="create"
      />
    </div>
  );
};

export default ProductCreatePage;
