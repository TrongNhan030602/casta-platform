import React, { useState } from "react";
import Button from "@/components/common/Button";
import ProductAdjustStockModal from "./ProductAdjustStockModal";
import ProductStockHistoryModal from "./ProductStockHistoryModal";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDateTime } from "@/utils/formatDateTime";

const ProductStockSection = ({ summary, productId, onRefresh }) => {
  const [openAdjust, setOpenAdjust] = useState(false);
  const [openHistory, setOpenHistory] = useState(false); // 🆕 dùng cho modal

  const safeSummary = summary || {};

  const stock = safeSummary.stock ?? "—";
  const avgCost =
    safeSummary.average_cost != null
      ? formatCurrency(Number(safeSummary.average_cost))
      : "—";
  const updatedAt = safeSummary.updated_at
    ? formatDateTime(safeSummary.updated_at)
    : "—";

  return (
    <>
      <div className="product-detail__section">
        <div className="product-detail__section-title">Tồn kho</div>
        <div className="product-detail__section-body">
          <div className="mb-3">
            <div>
              <strong>Tồn kho hiện tại:</strong> {stock}
            </div>
            <div>
              <strong>Giá vốn TB:</strong> {avgCost}
            </div>
            <div>
              <strong>Ngày cập nhật:</strong> {updatedAt}
            </div>
          </div>

          <div className="d-flex flex-column gap-2 mt-2">
            <Button
              variant="primary"
              onClick={() => setOpenAdjust(true)}
            >
              Điều chỉnh tồn kho
            </Button>

            <Button
              variant="secondary"
              onClick={() => setOpenHistory(true)}
            >
              Xem lịch sử điều chỉnh
            </Button>
          </div>
        </div>
      </div>

      {/* Modal điều chỉnh tồn kho */}
      <ProductAdjustStockModal
        open={openAdjust}
        onClose={() => setOpenAdjust(false)}
        productId={productId}
        onSuccess={onRefresh}
      />

      {/* Modal lịch sử tồn kho */}
      <ProductStockHistoryModal
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        productId={productId}
      />
    </>
  );
};

export default ProductStockSection;
