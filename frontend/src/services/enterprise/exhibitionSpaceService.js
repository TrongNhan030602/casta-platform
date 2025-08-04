import axiosClient from "@/services/shared/axiosClient";

// ===============================
// 🏢 DOANH NGHIỆP - KHÔNG GIAN TRƯNG BÀY
// ===============================
// 📌 Lấy danh mục dạng cây (tree)
export const getExhibitionSpaceCategoryTree = () =>
  axiosClient.get("/exhibition-space-categories/tree");
// 📌 Lấy danh sách tất cả không gian (có thể filter: trạng thái, trống, theo zone, category, v.v.)
export const getExhibitionSpaces = (params = {}) =>
  axiosClient.get("/exhibition-spaces", { params }); // status nếu cần: available,booked,maintenance

// 📌 Xem chi tiết 1 không gian cụ thể
export const getExhibitionSpaceById = (id) =>
  axiosClient.get(`/exhibition-spaces/${id}`);
