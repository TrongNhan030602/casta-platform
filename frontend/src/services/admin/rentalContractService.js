import axiosClient from "@/services/shared/axiosClient";

// ===============================
// 🛠️ ADMIN - HỢP ĐỒNG THUÊ
// ===============================

// 📌 Tạo hợp đồng thuê offline (chỉ dành cho ADMIN, CVCC)
export const createOfflineRentalContract = (data) =>
  axiosClient.post("/rental-contracts/offline", data);

// 📌 Lấy danh sách không gian còn trống để thuê (có thể lọc theo nhiều tiêu chí)
export const getContracts = (params = {}) =>
  axiosClient.get("/rental-contracts", { params });

// 📌 Duyệt hợp đồng (chỉ khi đang pending)
export const approveRentalContract = (id) =>
  axiosClient.patch(`/rental-contracts/${id}/approve`);

// 📌  Danh sách hợp đồng đang hoạt động
export const getActiveRentalContracts = (params = {}) =>
  axiosClient.get("/rental-contracts/active", { params });

// 📌  Từ chối hợp đồng đang pending
export const rejectRentalContract = (id, data) =>
  axiosClient.patch(`/rental-contracts/${id}/reject`, data);

// 📌  Xem chi tiết hợp đồng
export const getRentalContractById = (id) =>
  axiosClient.get(`/rental-contracts/${id}`);

// 📌 Xoá hợp đồng thuê (chỉ khi chưa duyệt hoặc bị huỷ/bị từ chối)
export const deleteRentalContract = (id) =>
  axiosClient.delete(`/rental-contracts/${id}`);

// 📌 Xử lý yêu cầu gia hạn hợp đồng (approve / reject)
export const handleContractExtension = (id, data) =>
  axiosClient.patch(`/rental-contracts/${id}/handle-extend`, data);

// 📌 Xem trước chi phí gia hạn hợp đồng (admin)
export const previewContractExtension = (id, newEndDate) =>
  axiosClient.get(`/rental-contracts/${id}/preview-extend`, {
    params: { new_end_date: newEndDate },
  });
