// @services/admin/exhibitionSpaceProductService.js
import axiosClient from "@/services/shared/axiosClient";

/* ===================================================
 📌 Sản phẩm trưng bày trong không gian (ExhibitionSpaceProduct)
=================================================== */

// 📌 Tạo mới sản phẩm gắn vào không gian thuê (DN, NVDN)
export const createExhibitionSpaceProduct = (data) =>
  axiosClient.post("/exhibition-space-products", data);

// 📌 Xoá sản phẩm khỏi không gian trưng bày (DN, NVDN)
export const deleteExhibitionSpaceProduct = (id) =>
  axiosClient.delete(`/exhibition-space-products/${id}`);

// 📌 Duyệt sản phẩm trưng bày (ADMIN, CVCC)
// status = 'approved' hoặc 'rejected' tuỳ theo mục đích
export const approveExhibitionSpaceProduct = (id, data) =>
  axiosClient.patch(`/exhibition-space-products/${id}/approve`, data);

// 📌 Lấy danh sách sản phẩm trưng bày (ADMIN dùng để lọc + duyệt)
export const getExhibitionSpaceProducts = (params) =>
  axiosClient.get("/exhibition-space-products", { params });
