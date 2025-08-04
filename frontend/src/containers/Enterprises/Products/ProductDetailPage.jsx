import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEnterpriseProductDetail,
  getProductStockSummary,
} from "@/services/enterprise/productService";
import Spinner from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";
import { FiArrowLeft } from "react-icons/fi";
import TwoColumnLayout from "@/layout/TwoColumnLayout";

import ProductInfoSection from "./components/ProductInfoSection";
import ProductImageSection from "./components/ProductImageSection";
import ProductStockSection from "./components/ProductStockSection";
import "@/assets/styles/layout/enterprise/product/product-detail.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [stockSummary, setStockSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    setLoading(true);

    try {
      const productRes = await getEnterpriseProductDetail(id);
      setProduct(productRes.data?.data || null);
    } catch (err) {
      console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", err);
      setProduct(null);
      setLoading(false);
      return;
    }

    try {
      const stockRes = await getProductStockSummary(id);
      setStockSummary(stockRes.data?.data || null);
    } catch (err) {
      if (err?.response?.status === 404) {
        console.warn("⚠️ Chưa có dữ liệu tồn kho cho sản phẩm.");
        setStockSummary(null); // fallback hợp lệ
      } else {
        console.error("❌ Lỗi khi lấy tồn kho:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) return <Spinner />;
  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  return (
    <TwoColumnLayout
      title={product.name}
      backButton={
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft className="me-1" />
          Quay lại
        </Button>
      }
      leftWidth="1fr"
      rightWidth="1fr"
      leftChildren={
        <>
          <ProductInfoSection product={product} />
          <ProductImageSection
            productId={product.id}
            images={product.images}
            onRefresh={fetchDetail}
          />
        </>
      }
      rightChildren={
        <ProductStockSection
          summary={stockSummary}
          productId={product.id}
          onRefresh={fetchDetail}
        />
      }
    />
  );
};

export default ProductDetailPage;
