import { EXHIBITION_PRODUCT_STATUS_OPTIONS } from "@/constants/exhibitionProductStatus";
export const buildFilterFields = (enterprises) => [
  {
    name: "keyword",
    type: "text",
    placeholder: "Tìm theo tên sản phẩm",
  },
  {
    name: "status",
    type: "select",
    options: [
      { label: "Tất cả: Trạng thái", value: "" },
      ...EXHIBITION_PRODUCT_STATUS_OPTIONS,
    ],
  },
  {
    name: "enterprise_id",
    type: "select",
    options: [
      { label: "Tất cả: Doanh nghiệp", value: "" },
      ...enterprises.map((e) => ({
        label: e.name,
        value: e.id,
      })),
    ],
  },
];
