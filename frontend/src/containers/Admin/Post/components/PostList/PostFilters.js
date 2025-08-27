// @/filters/admin/getPostFilterFields.js
import { POST_STATUS_OPTIONS } from "@/constants/postStatus";
import { POST_TYPE_OPTIONS } from "@/constants/postType";

const getPostFilterFields = (categories = []) => {
  return [
    {
      name: "keyword",
      type: "text",
      placeholder: "Tìm theo tiêu đề hoặc nôi dung",
    },
    {
      name: "category_id",
      type: "select",
      placeholder: "Lọc theo danh mục",
      options: [
        { label: "Danh mục: Tất cả", value: "" },
        ...categories.map((cat) => ({
          label: cat.label, // đã flatten dạng — Tên hoặc A > B
          value: String(cat.value),
        })),
      ],
    },
    {
      name: "type",
      type: "select",
      placeholder: "Loại bài viết",
      options: [
        { label: "Loại: Tất cả", value: "" },
        ...POST_TYPE_OPTIONS.map((opt) => ({
          ...opt,
          value: String(opt.value),
        })),
      ],
    },
    {
      name: "status",
      type: "select",
      placeholder: "Trạng thái",
      options: [
        { label: "Trạng thái: Tất cả", value: "" },
        ...POST_STATUS_OPTIONS.map((opt) => ({
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

export default getPostFilterFields;
