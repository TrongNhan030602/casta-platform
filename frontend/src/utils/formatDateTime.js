// utils/formatDateTime.js
import { parseISO, format } from "date-fns";

export function formatDateTime(isoString, formatStr = "dd/MM/yyyy HH:mm") {
  if (!isoString) return "";

  try {
    const date = parseISO(isoString);
    return format(date, formatStr);
  } catch (error) {
    console.error("Lỗi khi format date:", error);
    return "Không hợp lệ";
  }
}
