import { STOCK_TYPE_OPTIONS } from "@/constants/stockTypes";

export const filterFields = [
  {
    name: "type",
    type: "select",
    options: [{ value: "", label: "Tất cả loại" }, ...STOCK_TYPE_OPTIONS],
  },
  {
    name: "keyword",
    type: "text",
    placeholder: "Nhập ghi chú...",
  },
];
