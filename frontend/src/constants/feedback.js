export const FEEDBACK_TYPES = {
  PRODUCT: "product",
  ENTERPRISE: "enterprise",
  SPACE: "space",
  SERVICE: "service",
};

export const FEEDBACK_TYPE_OPTIONS = [
  { value: "", label: "Tất cả loại" },
  { value: FEEDBACK_TYPES.SPACE, label: "Không gian" },
  { value: FEEDBACK_TYPES.PRODUCT, label: "Sản phẩm" },
  { value: FEEDBACK_TYPES.ENTERPRISE, label: "Doanh nghiệp" },
  { value: FEEDBACK_TYPES.SERVICE, label: "Dịch vụ" },
];

export const FEEDBACK_STATUSES = {
  NEW: "new",
  REVIEWED: "reviewed",
  RESOLVED: "resolved",
};

export const FEEDBACK_STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: FEEDBACK_STATUSES.NEW, label: "Chưa xử lý" },
  { value: FEEDBACK_STATUSES.REVIEWED, label: "Đã xem" },
  { value: FEEDBACK_STATUSES.RESOLVED, label: "Đã phản hồi" },
];

export const FEEDBACK_STATUS_COLORS = {
  new: "warning", // badge--warning: vàng, chữ đen
  reviewed: "info", // badge--info: xanh biển
  resolved: "success", // badge--success: xanh lá
};

// Lấy nhãn tiếng Việt từ FEEDBACK_TYPE_OPTIONS
export const getTypeLabel = (value) => {
  return (
    FEEDBACK_TYPE_OPTIONS.find((opt) => opt.value === value)?.label || value
  );
};

// Lấy nhãn tiếng Việt từ FEEDBACK_STATUS_OPTIONS
export const getStatusLabel = (value) => {
  return (
    FEEDBACK_STATUS_OPTIONS.find((opt) => opt.value === value)?.label || value
  );
};
