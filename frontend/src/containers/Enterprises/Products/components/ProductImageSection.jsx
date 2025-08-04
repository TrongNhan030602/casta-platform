import React, { useState } from "react";
import Button from "@/components/common/Button";
import { FiImage } from "react-icons/fi";
import { getStorageUrl } from "@/utils/getStorageUrl";
import ProductImageManagerModal from "./ProductImageManagerModal";

const ProductImageSection = ({ images = [], productId, onRefresh }) => {
  const [showManager, setShowManager] = useState(false);

  return (
    <div className="product-detail__section">
      <div className="product-detail__section-title">Ảnh sản phẩm</div>

      <div className="product-detail__section-body">
        <div className="product-detail__image-list">
          {images.map((img) => (
            <div
              key={img.id}
              className="product-detail__image-item"
              data-main={img.is_main ? "Ảnh chính" : null}
            >
              <img
                src={getStorageUrl(img.url)}
                alt="Ảnh sản phẩm"
                className={`product-detail__image ${
                  img.is_main ? "product-detail__image--main" : ""
                }`}
              />
            </div>
          ))}
        </div>

        <div className="product-detail__image-action mt-3">
          <Button
            variant="outline"
            onClick={() => setShowManager(true)}
          >
            <FiImage className="me-1" />
            Quản lý ảnh
          </Button>
        </div>
      </div>

      <ProductImageManagerModal
        open={showManager}
        onClose={() => setShowManager(false)}
        productId={productId}
        images={images}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default ProductImageSection;
