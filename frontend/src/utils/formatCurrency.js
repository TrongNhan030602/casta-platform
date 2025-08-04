// @/utils/formatCurrency.js

export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0 VNĐ";

  return Number(value)
    .toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    })
    .replace("₫", "VNĐ");
};
