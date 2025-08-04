import { FaTruck, FaShippingFast, FaStore } from "react-icons/fa";

export const SHIPPING_TYPES = {
  calculated: {
    value: "calculated",
    label: "Tính phí vận chuyển",
    color: "danger",
    icon: FaShippingFast,
  },
  free: {
    value: "free",
    label: "Miễn phí vận chuyển",
    color: "primary",
    icon: FaTruck,
  },
  pickup: {
    value: "pickup",
    label: "Đến lấy hàng",
    color: "info",
    icon: FaStore,
  },
};

export const SHIPPING_TYPE_OPTIONS = Object.values(SHIPPING_TYPES).map(
  ({ value, label }) => ({ value, label })
);
