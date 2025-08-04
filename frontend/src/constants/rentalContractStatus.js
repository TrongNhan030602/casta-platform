import {
  MdPending,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdBlock,
} from "react-icons/md";

export const RENTAL_CONTRACT_STATUSES = {
  pending: {
    value: "pending",
    label: "Chờ duyệt",
    color: "warning",
    icon: MdPending,
  },
  approved: {
    value: "approved",
    label: "Đã duyệt",
    color: "success",
    icon: MdCheckCircle,
  },
  cancelled: {
    value: "cancelled",
    label: "Đã hủy",
    color: "dark",
    icon: MdCancel,
  },
  expired: {
    value: "expired",
    label: "Hết hạn",
    color: "orange",
    icon: MdAccessTime,
  },
  rejected: {
    value: "rejected",
    label: "Đã từ chối",
    color: "danger",
    icon: MdBlock,
  },
};
