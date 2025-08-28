const getTagFilterFields = () => [
  {
    name: "keyword",
    type: "text",
    placeholder: "Tìm theo slug (vd: khuyen-mai)",
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

export default getTagFilterFields;
