// src/constants/productTag.js

export const PRODUCT_TAGS = {
  hot: {
    value: "hot",
    label: "Hot",
    color: "danger",
  },
  new: {
    value: "new",
    label: "Mới",
    color: "success",
  },
  sale: {
    value: "sale",
    label: "Khuyến mãi",
    color: "warning",
  },
  limited: {
    value: "limited",
    label: "Giới hạn",
    color: "info",
  },
};

// Cho dropdown, filter, multi-select...
export const PRODUCT_TAG_OPTIONS = Object.values(PRODUCT_TAGS).map(
  ({ value, label }) => ({ value, label })
);
