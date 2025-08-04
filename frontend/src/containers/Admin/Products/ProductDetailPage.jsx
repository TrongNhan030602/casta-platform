import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminProductDetail } from "@/services/admin/productService";
import Spinner from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";
import NotFoundMessage from "@/components/common/NotFoundMessage";
import { FiArrowLeft } from "react-icons/fi";
import TwoColumnLayout from "@/layout/TwoColumnLayout";

import ProductInfoSection from "./components/ProductDetail/ProductInfoSection";
import ProductImageSection from "./components/ProductDetail/ProductImageSection";
import "@/assets/styles/layout/enterprise/product/product-detail.css"; // dùng chung phía doanh nghiêp

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminProductDetail(id);
      setProduct(res.data?.data || null);
    } catch (err) {
      console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) return <Spinner />;
  if (!product) {
    return (
      <NotFoundMessage
        message="Không tìm thấy sản phẩm"
        backTo="/admin/products"
      />
    );
  }

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
      leftWidth="2fr"
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
        <div className="product-detail__section">
          <div className="product-detail__section-title">Thống kê</div>
          <div className="product-detail__section-body">
            <p>Đã xem: {product.views_count?.toLocaleString() || 0} lượt</p>
            <p>Đã mua: {product.purchased_count?.toLocaleString() || 0}</p>
            <p>
              Đánh giá:{" "}
              {product.average_rating
                ? `${product.average_rating} ⭐`
                : "Chưa có"}{" "}
              ({product.reviews_count || 0} đánh giá)
            </p>
          </div>
        </div>
      }
    />
  );
};

export default ProductDetailPage;
