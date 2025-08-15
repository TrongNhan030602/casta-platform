// src/constants/newsCategoryStatus.js

export const NEWS_CATEGORY_STATUSES = {
  draft: {
    value: "draft",
    label: "Bản nháp",
    color: "secondary",
  },
  published: {
    value: "published",
    label: "Đã công bố",
    color: "success",
  },
  archived: {
    value: "archived",
    label: "Đã lưu trữ",
    color: "warning",
  },
};

// Dùng cho dropdown, select filter...
export const NEWS_CATEGORY_STATUS_OPTIONS = Object.values(
  NEWS_CATEGORY_STATUSES
).map(({ value, label }) => ({ value, label }));
