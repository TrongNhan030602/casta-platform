// utils/roles.js

/** Đổi mã vai trò sang nhãn dễ đọc */
export const roleLabelMap = {
  admin: "Quản trị hệ thống",
  cvcc: "Chuyên viên QLCC",
  cvql: "Chuyên viên QL",
  qlgh: "Quản lý gian hàng",
  dn: "Doanh nghiệp",
  nvdn: "NV doanh nghiệp",
  kh: "Khách hàng",
  cskh: "Chăm sóc khách hàng",
  kt: "Kế toán viên",
  qlnd: "Quản lý nội dung",
};
export const systemRoles = [
  "admin",
  "cvcc",
  "cvql",
  "qlgh",
  "cskh",
  "kt",
  "qlnd",
];

/** Đổi trạng thái sang nhãn và màu */
export const statusMap = {
  active: { label: "Hoạt động", color: "success" },
  inactive: { label: "Tạm khóa", color: "danger" },
  pending: { label: "Chờ duyệt", color: "warning" },
  rejected: { label: "Từ chối", color: "orange" },
};
/** Gán màu badge theo vai trò */
export const roleColorMap = {
  admin: "danger",
  cvcc: "orange",
  cvql: "success",
  qlgh: "warning",
  cskh: "info",
  kt: "dark",
  qlnd: "dark",
  dn: "primary", //
  nvdn: "primary", //
  kh: "info", //
};

/** Trả về đường dẫn redirect theo vai trò */
export const redirectByRole = (role) => {
  if (!role) return "/";

  switch (role.toUpperCase()) {
    case "ADMIN":
      return "/admin";
    case "CVCC":
    case "CVQL":
      return "/management";
    case "QLGH":
      return "/exhibition";
    case "DN":
    case "NVDN":
      return "/enterprise";
    case "KH":
      return "/customer";
    case "CSKH":
      return "/support";
    case "KT":
      return "/finance";
    case "QLND":
      return "/content-management";
    default:
      return "/";
  }
};
