import { SERVICE_CATEGORY_STATUS_OPTIONS } from "@/constants/serviceCategoryStatus";

const getServiceCategoryFilterFields = (rootCategories = []) => [
  {
    name: "keyword",
    type: "text",
    placeholder: "Tìm theo slug (vd: sua-chua-dien-thoai)",
  },
  {
    name: "parent_id",
    type: "select",
    placeholder: "Lọc theo danh mục cha",
    options: [
      { label: "Danh mục cha: Tất cả", value: "" },
      ...rootCategories.map((cat) => ({
        label: `${cat.name}`,
        value: String(cat.id),
      })),
    ],
  },
  {
    name: "status",
    type: "select",
    placeholder: "Trạng thái",
    options: [
      { label: "Trạng thái: Tất cả", value: "" },
      ...SERVICE_CATEGORY_STATUS_OPTIONS.map((opt) => ({
        ...opt,
        value: String(opt.value),
      })),
    ],
  },
  {
    name: "deleted",
    type: "select",
    placeholder: "Trạng thái xóa",
    options: [
      { label: "Chưa xóa", value: "" },
      { label: "Đã xóa", value: "only" },
      { label: "Tất cả", value: "all" },
    ],
  },
];

export default getServiceCategoryFilterFields;
