const filterFields = [
  {
    name: "status",
    type: "select",
    options: [
      { value: "", label: "Tất cả" },
      { value: "pending", label: "Chờ duyệt" },
      { value: "approved", label: "Đã duyệt" },
      { value: "rejected", label: "Từ chối" },
      { value: "cancelled", label: "Đã hủy" },
      { value: "expired", label: "Đã hết hạn" },
    ],
  },
  {
    name: "keyword",
    type: "text",
    placeholder: "Tìm theo mã/tên ",
  },
];

export default filterFields;
