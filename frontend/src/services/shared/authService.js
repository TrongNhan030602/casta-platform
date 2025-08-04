// authService.js
import axiosClient from "./axiosClient";

// ===================
// Auth Service Calls
// ===================

export const loginApi = (data) => axiosClient.post("/auth/login", data);
export const refreshToken = () => axiosClient.post("/auth/refresh"); // gọi ngầm trong axiosClient
export const logout = () => axiosClient.post("/auth/logout");

export const getMe = () => axiosClient.get("/auth/me");
export const changePassword = (data) =>
  axiosClient.post("/auth/change-password", data);

// Optional: khôi phục mật khẩu
export const sendResetLink = (email) =>
  axiosClient.post("/auth/forgot-password", { email });
export const resetPassword = (data) =>
  axiosClient.post("/auth/reset-password", data);

// Optional: xác thực email
export const verifyEmail = (token) =>
  axiosClient.post("/auth/verify-email", { token });
export const resendVerificationEmail = (email) =>
  axiosClient.post("/auth/resend-verification", { email });

// Optional: đăng ký
export const registerCustomer = (data) =>
  axiosClient.post("/auth/register/customer", data);
export const registerEnterprise = (data) =>
  axiosClient.post("/auth/register/enterprise", data);

// Optional: Gửi yêu cầu mở khóa sau khi bị vô hiệu hóa
export const requestReactivation = (identifier, password) => {
  return axiosClient.post("/auth/request-reactivation", {
    identifier,
    password,
  });
};
