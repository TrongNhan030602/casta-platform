// @services/admin/enterpriseService.js

import axiosClient from "@/services/shared/axiosClient";
/**
 * Lấy danh sách doanh nghiệp
 * @param {Object} params - Các tham số lọc (search, status, per_page, ...)
 */
export const getEnterprises = (params = {}) => {
  return axiosClient.get("/enterprises", { params });
};

/**
 * Lấy danh sách doanh nghiệp đã duyệt (đơn giản - dùng cho dropdown, v.v.)
 */
export const getSimpleApprovedEnterprises = (keyword = "", limit = 100) => {
  return axiosClient.get("/enterprises/simple", {
    params: {
      keyword,
      limit,
    },
  });
};

/**
 * Lấy doanh nghiệp đã duyệt (dùng cho dropdown chọn khi tạo nhân viên DN)
 */
export const getApprovedEnterprises = () => {
  return getEnterprises({ status: "approved", per_page: 100 });
};

/**
 * Lấy chi tiết doanh nghiệp theo ID
 */
export const getEnterpriseById = (id) => {
  return axiosClient.get(`/enterprises/${id}`);
};

/**
 * Duyệt doanh nghiệp
 */
export const approveEnterprise = (id) => {
  return axiosClient.patch(`/enterprises/${id}/approve`);
};

/**
 * Từ chối doanh nghiệp
 */
export const rejectEnterprise = (id) => {
  return axiosClient.patch(`/enterprises/${id}/reject`);
};

/**
 * Tạm ngưng hoạt động
 */
export const suspendEnterprise = (id) => {
  return axiosClient.patch(`/enterprises/${id}/suspend`);
};

/**
 * Bật lại hoạt động
 */
export const resumeEnterprise = (id) => {
  return axiosClient.patch(`/enterprises/${id}/resume`);
};
