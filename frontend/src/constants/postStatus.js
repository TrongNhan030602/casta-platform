export const POST_STATUSES = {
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

// Dùng cho <Select />, filter...
export const POST_STATUS_OPTIONS = Object.values(POST_STATUSES).map(
  ({ value, label }) => ({ value, label })
);
