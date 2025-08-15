// @services/admin/serviceCategoriesService.js
import axiosClient from "@/services/shared/axiosClient";

// ============================= Danh mục dịch vụ ===========================================

// 1. Lấy danh sách danh mục dịch vụ (có phân trang, filter)
export const getServiceCategoryList = (params = {}) =>
  axiosClient.get("/service-categories", { params });

// 2. Tạo mới danh mục dịch vụ
export const createServiceCategory = (data) =>
  axiosClient.post("/service-categories", data);

// 3. Cập nhật danh mục dịch vụ
export const updateServiceCategory = (id, data) =>
  axiosClient.put(`/service-categories/${id}`, data);

// 4. Xóa mềm danh mục dịch vụ
export const deleteServiceCategory = (id, params = {}) =>
  axiosClient.delete(`/service-categories/${id}`, { params });

// 5. Lấy cây danh mục dịch vụ (không phân trang)
export const getServiceCategoryTree = () =>
  axiosClient.get("/service-categories/tree");

// 6. Lấy chi tiết danh mục dịch vụ theo ID
export const getServiceCategoryById = (id) =>
  axiosClient.get(`/service-categories/${id}`);

// 7. Khôi phục danh mục dịch vụ đã xóa mềm
export const restoreServiceCategory = (id, params = {}) =>
  axiosClient.patch(`/service-categories/${id}/restore`, { params });

// 8. Xóa vĩnh viễn danh mục dịch vụ
export const forceDeleteServiceCategory = (id, params = {}) =>
  axiosClient.delete(`/service-categories/${id}/force-delete`, { params });
