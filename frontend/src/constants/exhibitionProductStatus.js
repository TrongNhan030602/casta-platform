// 📁 src/constants/exhibitionProductStatus.js
import { FaCheckCircle, FaClock, FaTimesCircle, FaBan } from "react-icons/fa";

export const EXHIBITION_PRODUCT_STATUSES = {
  approved: {
    value: "approved",
    label: "Đã duyệt",
    color: "success",
    icon: FaCheckCircle,
  },
  pending: {
    value: "pending",
    label: "Chờ duyệt",
    color: "warning",
    icon: FaClock,
  },
  rejected: {
    value: "rejected",
    label: "Từ chối",
    color: "danger",
    icon: FaTimesCircle,
  },
};

export const EXHIBITION_PRODUCT_STATUS_OPTIONS = Object.values(
  EXHIBITION_PRODUCT_STATUSES
).map(({ value, label }) => ({ value, label }));
