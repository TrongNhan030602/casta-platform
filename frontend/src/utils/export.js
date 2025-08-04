import * as XLSX from "xlsx";

/**
 * Chuyển mảng dữ liệu JSON thành file Excel và tải về
 * @param {Array<Object>} data - Dữ liệu cần export
 * @param {String} filename - Tên file không đuôi
 * @param {String} sheetName - Tên sheet (tuỳ chọn, mặc định: "Sheet1")
 */
export const exportToExcel = (
  data,
  filename = "data",
  sheetName = "Sheet1"
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
