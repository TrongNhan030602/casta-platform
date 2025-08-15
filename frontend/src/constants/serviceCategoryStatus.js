// src/constants/serviceCategoryStatus.js

export const SERVICE_CATEGORY_STATUSES = {
  draft: {
    value: "draft",
    label: "Nháp",
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

// Dùng cho dropdown, select filter...
export const SERVICE_CATEGORY_STATUS_OPTIONS = Object.values(
  SERVICE_CATEGORY_STATUSES
).map(({ value, label }) => ({ value, label }));
