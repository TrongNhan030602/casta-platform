import axiosClient from "@/services/shared/axiosClient";

// 📌 Tạo mới sản phẩm gắn vào không gian thuê
export const createExhibitionSpaceProduct = (data) =>
  axiosClient.post("/exhibition-space-products", data);

// 📌 Cập nhật thông tin sản phẩm đã gắn
export const updateExhibitionSpaceProduct = (id, data) =>
  axiosClient.patch(`/exhibition-space-products/${id}`, data);

// 📌 Xoá sản phẩm khỏi không gian trưng bày
export const deleteExhibitionSpaceProduct = (id) =>
  axiosClient.delete(`/exhibition-space-products/${id}`);

// 📌 Duyệt sản phẩm trưng bày (ADMIN)
export const approveExhibitionSpaceProduct = (id, data) =>
  axiosClient.patch(`/exhibition-space-products/${id}/approve`, data);
