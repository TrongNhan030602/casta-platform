// utils/formatDateOnly.js
import { parseISO, format } from "date-fns";

/**
 * Format ngày (không có giờ) từ chuỗi ISO.
 * @param {string} isoString - Chuỗi ngày ISO (VD: "2024-01-01")
 * @param {string} formatStr - Định dạng (mặc định "dd/MM/yyyy")
 * @returns {string} Chuỗi ngày đã format hoặc "Không hợp lệ"
 */
export function formatDateOnly(isoString, formatStr = "dd/MM/yyyy") {
  if (!isoString) return "";

  try {
    const date = parseISO(isoString);
    return format(date, formatStr);
  } catch (error) {
    console.error("Lỗi khi format date:", error);
    return "Không hợp lệ";
  }
}
