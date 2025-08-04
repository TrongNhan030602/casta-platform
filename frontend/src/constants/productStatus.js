// src/constants/productStatus.js

export const PRODUCT_STATUSES = {
  draft: {
    value: "draft",
    label: "Bản nháp",
    color: "secondary",
  },
  pending: {
    value: "pending",
    label: "Chờ duyệt",
    color: "warning",
  },
  published: {
    value: "published",
    label: "Đã công khai",
    color: "success",
  },
  rejected: {
    value: "rejected",
    label: "Bị từ chối",
    color: "danger",
  },
  disabled: {
    value: "disabled",
    label: "Ngừng hiển thị",
    color: "info",
  },
};

// Dùng cho dropdown, select filter...
export const PRODUCT_STATUS_OPTIONS = Object.values(PRODUCT_STATUSES).map(
  ({ value, label }) => ({ value, label })
);
