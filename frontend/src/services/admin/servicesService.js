// @services/admin/servicesService.js
import axiosClient from "@/services/shared/axiosClient";

// ============================= Dịch vụ ===========================================

// 1. Lấy danh sách dịch vụ (có phân trang, filter)
export const getServiceList = (params = {}) =>
  axiosClient.get("/services", { params });

// 2. Tạo mới dịch vụ
export const createService = (data) => axiosClient.post("/services", data);

// 3. Cập nhật dịch vụ
export const updateService = (id, data) =>
  axiosClient.put(`/services/${id}`, data);

// 4. Xóa mềm dịch vụ
export const deleteService = (id, params = {}) =>
  axiosClient.delete(`/services/${id}`, { params });

// 5. Lấy chi tiết dịch vụ theo ID
export const getServiceById = (id) => axiosClient.get(`/services/${id}`);

// 6. Khôi phục dịch vụ đã xóa mềm
export const restoreService = (id, params = {}) =>
  axiosClient.patch(`/services/${id}/restore`, { params });

// 7. Xóa vĩnh viễn dịch vụ
export const forceDeleteService = (id, params = {}) =>
  axiosClient.delete(`/services/${id}/force-delete`, { params });
