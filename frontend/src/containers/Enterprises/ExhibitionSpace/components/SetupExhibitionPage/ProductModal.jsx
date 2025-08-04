import React, { useEffect, useState } from "react";
import SelectBox from "@/components/common/SelectBox";
import TextArea from "@/components/common/TextArea";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { getEnterpriseCompactProducts } from "@/services/enterprise/productService";
import { createExhibitionSpaceProduct } from "@/services/enterprise/exhibitionSpaceProductService";

const ProductModal = ({
  open,
  onClose,
  coords,
  contractId,
  panoramaId,
  onSuccess,
  existingMarkers = [],
}) => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (!open) return;

    setError(null);
    setValidationError(null);
    setLoading(false);
    setSelectedProductId("");
    setNote("");

    const fetchProducts = async () => {
      try {
        const res = await getEnterpriseCompactProducts();
        let fetchedProducts = res.data?.data || [];

        const usedProductIds = existingMarkers.map(
          (marker) => marker.productId || marker.product?.id
        );

        fetchedProducts = fetchedProducts.filter(
          (p) => !usedProductIds.includes(p.id)
        );

        setProducts(fetchedProducts);

        if (fetchedProducts.length === 0) {
          setError(
            "Tất cả sản phẩm đã được gắn. Không còn sản phẩm nào để chọn."
          );
        }
      } catch (err) {
        setError("Không tải được danh sách sản phẩm, vui lòng thử lại.");
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
      }
    };

    fetchProducts();
  }, [open, existingMarkers]);

  const validateForm = () => {
    if (!selectedProductId) {
      setValidationError("Bạn phải chọn sản phẩm.");
      return false;
    }
    if (!coords || !panoramaId || !contractId) {
      setValidationError("Dữ liệu vị trí hoặc hợp đồng không hợp lệ.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;

    const payload = {
      rental_contract_id: Number(contractId),
      product_id: selectedProductId,
      note: note || null,
      position_metadata: {
        panoramaId,
        yaw: coords.yaw,
        pitch: coords.pitch,
      },
    };

    setLoading(true);
    try {
      await createExhibitionSpaceProduct(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Gắn sản phẩm thất bại, vui lòng thử lại.");
      console.error("Lỗi khi gắn sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  const options = products.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const isConfirmDisabled =
    loading || !selectedProductId || products.length === 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Gắn sản phẩm vào ảnh 360"
    >
      {error && <p className="text-danger mb-3">{error}</p>}

      <div className="mb-3">
        <SelectBox
          id="selectProduct"
          label="Chọn sản phẩm"
          required
          value={selectedProductId}
          onChange={(val) => setSelectedProductId(val)}
          options={options}
          error={validationError && !selectedProductId ? validationError : ""}
          isClearable={false}
          placeholder="-- Chọn sản phẩm --"
          disabled={loading || products.length === 0}
        />
      </div>

      <div className="mb-3">
        <TextArea
          label="Ghi chú (tuỳ chọn)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={loading}
          placeholder="Ví dụ: nổi bật, trưng bày giữa hoặc cạnh lối vào"
          rows={2}
          hint="Thông tin này giúp admin và khách hàng hiểu rõ vị trí trưng bày hơn"
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Huỷ
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          loading={loading}
          disabled={isConfirmDisabled}
        >
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};

export default ProductModal;
