import axiosClient from "@/services/shared/axiosClient";

// ===============================
// 🏢 DOANH NGHIỆP - HỢP ĐỒNG THUÊ
// ===============================

// 📌  Gửi yêu cầu thuê không gian
export const createRentalContract = (data) =>
  axiosClient.post("/rental-contracts", data);

// 📌  Yêu cầu hủy hợp đồng nếu chưa được duyệt
export const cancelRentalContract = (id, data) =>
  axiosClient.patch(`/rental-contracts/${id}/cancel`, data);

// 📌  Yêu cầu gia hạn hợp đồng nếu đã được duyệt
export const extendRentalContract = (id) =>
  axiosClient.patch(`/rental-contracts/${id}/extend`);

// 📌  Lịch sử hợp đồng của DN hiện tại
export const getMyRentalContracts = (params = {}) =>
  axiosClient.get("/rental-contracts/mine", { params });

// 📌  Xem chi tiết hợp đồng
export const getRentalContractById = (id) =>
  axiosClient.get(`/rental-contracts/${id}`);

// 📌 Xoá hợp đồng thuê (chỉ khi chưa duyệt hoặc bị huỷ/bị từ chối)
export const deleteRentalContract = (id) =>
  axiosClient.delete(`/rental-contracts/${id}`);
