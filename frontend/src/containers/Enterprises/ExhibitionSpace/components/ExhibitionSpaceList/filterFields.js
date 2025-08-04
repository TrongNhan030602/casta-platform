export const STATUS_OPTIONS = [
  { label: "Tất cả", value: "" },
  { label: "Trống", value: "available" },
  { label: "Đang sử dụng", value: "booked" },
  { label: "Bảo trì", value: "maintenance" },
];

export const getFilterFields = (categoryOptions = []) => [
  { name: "keyword", type: "text", placeholder: "Tìm mã hoặc vị trí" },
  {
    name: "status",
    type: "select",
    placeholder: "Trạng thái",
    options: STATUS_OPTIONS,
  },
  {
    name: "category_id",
    type: "select",
    placeholder: "Danh mục",
    options: categoryOptions,
  },
];
