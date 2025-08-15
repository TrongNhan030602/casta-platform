/**
 * Chuyển text bất kỳ thành slug chuẩn tiếng Việt
 * - Loại bỏ dấu
 * - Chuyển chữ đ -> d
 * - Thay ký tự đặc biệt và khoảng trắng bằng "-"
 * - Lowercase hoàn toàn
 * @param {string} text
 * @returns {string}
 */
export const generateSlug = (text) => {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
