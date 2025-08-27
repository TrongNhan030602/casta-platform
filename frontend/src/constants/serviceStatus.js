// @/constants/serviceStatus.js
export const SERVICE_STATUSES = {
  draft: {
    value: "draft",
    label: "Bản nháp",
    color: "secondary",
  },
  published: {
    value: "published",
    label: "Đang hiển thị",
    color: "success",
  },
  archived: {
    value: "archived",
    label: "Đã lưu trữ",
    color: "warning",
  },
};

// Dùng cho <Select /> hoặc filter
export const SERVICE_STATUS_OPTIONS = Object.values(SERVICE_STATUSES).map(
  ({ value, label }) => ({ value, label })
);
