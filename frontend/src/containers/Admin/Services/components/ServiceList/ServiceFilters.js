import { SERVICE_STATUS_OPTIONS } from "@/constants/serviceStatus";

const getServiceFilterFields = (categories = []) => {
  return [
    {
      name: "keyword",
      type: "text",
      placeholder: "Tìm theo tiêu đề hoặc nội dung",
    },
    {
      name: "category_id",
      type: "select",
      placeholder: "Lọc theo danh mục dịch vụ",
      options: [
        { label: "Danh mục: Tất cả", value: "" },
        ...categories.map((cat) => ({
          label: cat.label, // đã flatten dạng — Tên hoặc A > B
          value: String(cat.value),
        })),
      ],
    },
    {
      name: "status",
      type: "select",
      placeholder: "Trạng thái dịch vụ",
      options: [
        { label: "Trạng thái: Tất cả", value: "" },
        ...SERVICE_STATUS_OPTIONS.map((opt) => ({
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
};

export default getServiceFilterFields;
