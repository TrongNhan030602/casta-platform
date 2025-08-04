import axiosClient from "@/services/shared/axiosClient";

// 📌 1. Lấy cảnh báo của chính mình
export const getMyViolations = () => axiosClient.get("/violations/me");

// ⚙️2.  Gửi params như: keyword, sort_by, sort_order, per_page, page
export const getViolationList = (params = {}) =>
  axiosClient.get("/violations", { params });

// 📌 3. Lấy cảnh báo của một user cụ thể
export const getViolationsByUser = (userId) =>
  axiosClient.get(`/violations/users/${userId}`);

// 📌 4. Gửi cảnh báo vi phạm cho user
export const warnUser = (userId, data) =>
  axiosClient.post(`/violations/users/${userId}/warn`, data);

// 📌 5. Xóa cảnh báo
export const deleteViolation = (violationId) =>
  axiosClient.delete(`/violations/${violationId}`);
