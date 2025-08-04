//\src\services\admin\userService.js

import axiosClient from "@/services/shared/axiosClient";

// ==========================
// 🧑‍💼 ADMIN - USER SERVICE
// ==========================

// 📌 0. Danh sách người dùng (có thể lọc & phân trang)
export const getUserList = (params = {}) =>
  axiosClient.get("/users", { params });

// 📌 1. Tạo tài khoản người dùng mới
export const createUser = (data) => axiosClient.post("/users", data);

// 📌 2. Cập nhật thông tin người dùng
export const updateUser = (userId, data) =>
  axiosClient.put(`/users/${userId}`, data);

// 📌 3. Kích hoạt / Tạm khóa tài khoản
export const toggleUserStatus = (userId, data) =>
  axiosClient.patch(`/users/${userId}/status`, data); // pending,active, inactive,rejected

// 📌 4. Duyệt tài khoản doanh nghiệp (tạm bỏ qua vì email có xác thực rồi)
export const reviewEnterprise = (userId, data) =>
  axiosClient.patch(`/users/${userId}/review`, data); //pending,active, inactive,rejected

// 📌 5. Cập nhật hồ sơ cá nhân (user hiện tại)
export const updateMyProfile = (data) =>
  axiosClient.put("/users/me/profile", data);

// 📌 6. Xem lịch sử đăng nhập
export const fetchLoginLogs = (userId) =>
  axiosClient.get(`/users/${userId}/login-logs`);

// 📌 7. Kiểm tra dữ liệu trước khi xóa
export const checkBeforeDelete = (userId) =>
  axiosClient.get(`/users/${userId}/check-delete`);

// 📌 8. Xóa tài khoản (có thể ép xóa nếu force = true)
export const deleteUser = (userId, force = false) =>
  axiosClient.delete(`/users/${userId}`, {
    data: force ? { force: true } : {},
  });

// 📌 9. Lấy thông tin chi tiết 1 người dùng
export const getUserById = (userId) => axiosClient.get(`/users/${userId}`);

// 📌 10. Phân quyền cho tài khoản hệ thống (chỉ admin hoặc cvcc được gọi)
export const assignUserRole = (userId, role) =>
  axiosClient.patch(`/users/${userId}/assign-role`, { role });

// 📌 11. Xoá 1 log đăng nhập (chỉ Admin/CVCC, không xoá của chính mình)
export const deleteLoginLogById = (logId) =>
  axiosClient.delete(`/users/login-logs/${logId}`);
