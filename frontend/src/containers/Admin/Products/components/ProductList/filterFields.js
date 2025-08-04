import { PRODUCT_STATUS_OPTIONS } from "@/constants/productStatus";

/**
 * Trả về cấu hình các trường lọc cho danh sách sản phẩm
 * @param {Array} categoryOptions - Danh sách danh mục dạng dropdown [{ label, value }]
 * @param {Array} enterpriseOptions - Danh sách doanh nghiệp dạng dropdown [{ label, value }]
 */
export const getFilterFields = (
  categoryOptions = [],
  enterpriseOptions = []
) => [
  {
    name: "keyword",
    type: "text",
    placeholder: "Tìm theo tên sản phẩm",
    debounce: true,
  },
  {
    name: "enterprise_id", // dùng ID để chính xác và dễ query backend
    type: "select",
    options: [
      { value: "", label: "Tất cả doanh nghiệp" },
      ...enterpriseOptions,
    ],
  },
  {
    name: "status",
    type: "select",
    options: [
      { value: "", label: "Tất cả trạng thái" },
      ...PRODUCT_STATUS_OPTIONS,
    ],
  },
  {
    name: "deleted",
    type: "select",
    options: [
      { label: "Chưa xoá", value: "none" },
      { label: "Đã xoá", value: "only" },
      { label: "Tất cả", value: "all" },
    ],
  },
  {
    name: "category_id",
    type: "select",
    options: [{ value: "", label: "Tất cả danh mục" }, ...categoryOptions],
  },
  {
    name: "price_min",
    type: "number",
    placeholder: "Giá từ",
  },
  {
    name: "price_max",
    type: "number",
    placeholder: "Giá đến",
  },
];
