import {
  FaArrowCircleUp,
  FaArrowCircleDown,
  FaWarehouse,
  FaShoppingCart,
  FaUndo,
  FaReceipt,
} from "react-icons/fa";

export const STOCK_TYPES = {
  adjust_increase: {
    value: "adjust_increase",
    label: "📈 Điều chỉnh tăng",
    icon: FaArrowCircleUp,
    color: "success",
    affectCostAllowed: true,
    isImport: true,
  },
  adjust_decrease: {
    value: "adjust_decrease",
    label: "📉 Điều chỉnh giảm",
    icon: FaArrowCircleDown,
    color: "danger",
    affectCostAllowed: true,
    isExport: true,
  },
  import: {
    value: "import",
    label: "📦 Nhập hàng",
    icon: FaWarehouse,
    color: "primary",
    affectCostForced: true,
    isImport: true,
  },
  sale: {
    value: "sale",
    label: "🛒 Bán hàng",
    icon: FaShoppingCart,
    color: "warning",
    isExport: true,
  },
  return_import: {
    value: "return_import",
    label: "↩️ Trả nhà cung cấp",
    icon: FaUndo,
    color: "danger",
    isExport: true,
  },
  return_sale: {
    value: "return_sale",
    label: "🧾 Khách trả hàng",
    icon: FaReceipt,
    color: "info",
    isImport: true,
    affectCostForced: true,
  },
};

export const STOCK_TYPE_OPTIONS = Object.values(STOCK_TYPES).map(
  ({ value, label }) => ({ value, label })
);
