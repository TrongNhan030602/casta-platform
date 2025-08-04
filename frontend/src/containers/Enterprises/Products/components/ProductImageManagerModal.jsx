import React, { useState, useRef } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { toast } from "react-toastify";
import { getStorageUrl } from "@/utils/getStorageUrl";
import {
  uploadProductImage,
  deleteProductImage,
  setMainProductImage,
} from "@/services/enterprise/productService";
import "@/assets/styles/layout/enterprise/product/product-image-manager.css";

const ProductImageManagerModal = ({
  open,
  productId,
  images,
  onClose,
  onRefresh,
}) => {
  const [uploading, setUploading] = useState(false);
  const [processingImageId, setProcessingImageId] = useState(null);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      await uploadProductImage(productId, formData);
      toast.success("Tải ảnh lên thành công");
      onRefresh();
    } catch (err) {
      toast.error("Tải ảnh lên thất bại");
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSetMain = async (imageId) => {
    setProcessingImageId(imageId);
    try {
      await setMainProductImage(productId, imageId);
      toast.success("Đặt ảnh chính thành công");
      onRefresh();
    } catch (err) {
      toast.error("Đặt ảnh chính thất bại");
      console.error("Set main failed", err);
    } finally {
      setProcessingImageId(null);
    }
  };

  const handleDelete = async (imageId) => {
    setProcessingImageId(imageId);
    try {
      await deleteProductImage(productId, imageId);
      toast.success("Xoá ảnh thành công");
      onRefresh();
    } catch (err) {
      toast.error("Xoá ảnh thất bại");
      console.error("Delete failed", err);
    } finally {
      setProcessingImageId(null);
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <Modal
      open={open}
      title="Quản lý ảnh sản phẩm"
      className="modal-md"
      onClose={onClose}
    >
      <div className="product-image-manager__upload mb-3">
        <Button
          variant="primary"
          className="m-2"
          onClick={triggerFileInput}
          disabled={uploading}
        >
          {uploading ? "Đang tải lên..." : "Tải ảnh lên"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          style={{ display: "none" }}
        />
      </div>

      <div className="product-image-manager__list">
        {images.length === 0 && (
          <p className="text-muted mt-2">Chưa có ảnh sản phẩm nào.</p>
        )}
        {images.map((img) => (
          <div
            key={img.id}
            className="product-image-manager__item"
          >
            <img
              src={getStorageUrl(img.url)}
              alt="Ảnh sản phẩm"
              className={`product-image-manager__img ${
                img.is_main ? "product-image-manager__img--main" : ""
              }`}
            />
            <div className="product-image-manager__actions">
              {!img.is_main && (
                <Button
                  size="sm"
                  onClick={() => handleSetMain(img.id)}
                  disabled={processingImageId === img.id}
                >
                  Đặt làm chính
                </Button>
              )}
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(img.id)}
                disabled={processingImageId === img.id}
              >
                Xoá
              </Button>
            </div>
            {img.is_main && (
              <span className="product-image-manager__label">Ảnh chính</span>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ProductImageManagerModal;
