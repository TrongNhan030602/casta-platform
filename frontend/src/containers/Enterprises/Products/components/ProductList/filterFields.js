import { PRODUCT_STATUS_OPTIONS } from "@/constants/productStatus";

export const getFilterFields = (categoryOptions = []) => [
  { name: "keyword", type: "text", placeholder: "Tìm theo tên sản phẩm" },
  {
    name: "status",
    type: "select",
    options: [
      { value: "", label: "Tất cả trạng thái" },
      ...PRODUCT_STATUS_OPTIONS,
    ],
  },
  {
    name: "category_id",
    type: "select",
    options: [{ value: "", label: "Tất cả danh mục" }, ...categoryOptions],
  },
  { name: "price_min", type: "number", placeholder: "Giá từ" },
  { name: "price_max", type: "number", placeholder: "Giá đến" },
  {
    name: "deleted",
    type: "select",
    options: [
      { value: "none", label: "Chưa xoá" },
      { value: "only", label: "Đã xoá" },
    ],
  },
];
