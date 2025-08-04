import axiosClient from "@/services/shared/axiosClient";

// ===============================
// 📣 DOANH NGHIỆP - PHẢN HỒI
// ===============================

// 📌 Gửi phản hồi
export const createFeedback = (data) => {
  return axiosClient.post("/feedbacks", data);
};

// 📌 Danh sách phản hồi của chính mình
export const getMyFeedbacks = (params = {}) => {
  return axiosClient.get("/feedbacks/mine", { params });
};

// 📌 Lọc danh sách tất cả phản hồi (admin, dn, cvql, ...)
export const getAllFeedbacks = (params = {}) => {
  return axiosClient.get("/feedbacks", { params });
};

// 📌 Xem chi tiết phản hồi
export const getFeedbackById = (id) => {
  return axiosClient.get(`/feedbacks/${id}`);
};

// 📌 Trả lời phản hồi
export const replyFeedback = (id, response) => {
  return axiosClient.post(`/feedbacks/${id}/reply`, { response });
};

// 📌 Xoá phản hồi
export const deleteFeedback = (id) => {
  return axiosClient.delete(`/feedbacks/${id}`);
};

// 📌 Lấy danh sách phản hồi theo loại + target_id
export const getFeedbacksByTarget = (params = {}) => {
  return axiosClient.get("/feedbacks/by-target", { params });
};

// 📌 Lấy thống kê phản hồi theo loại + target_id
export const getFeedbackStatistics = (params = {}) => {
  return axiosClient.get("/feedbacks/statistics", { params });
};
