import { FaClock, FaCheckCircle, FaTimesCircle, FaBan } from "react-icons/fa";

export const STATUS_MAP = {
  pending: {
    label: "Chờ duyệt",
    icon: <FaClock title="Chờ duyệt" />,
    color: "warning",
  },
  approved: {
    label: "Đã duyệt",
    icon: <FaCheckCircle title="Đã duyệt" />,
    color: "success",
  },
  rejected: {
    label: "Từ chối",
    icon: <FaTimesCircle title="Từ chối" />,
    color: "danger",
  },
  cancelled: {
    label: "Đã hủy",
    icon: <FaBan title="Đã hủy" />,
    color: "danger",
  },
  expired: {
    label: "Đã hết hạn",
    icon: <FaClock title="Đã hết hạn" />,
    color: "secondary",
  },
};
