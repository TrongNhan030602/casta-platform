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

// 📌 Lấy danh sách sản phẩm doanh nghiệp đã trưng bày
export const getMyExhibitionSpaceProducts = (params = {}) =>
  axiosClient.get("/exhibition-space-products/mine", { params });

// 📌 Lấy danh sách sản phẩm đã gắn trong không gian theo hợp đồng thuê
// 🔸 params:
//    - panorama_id (string): ID của ảnh panorama cần lọc (tuỳ chọn)
//    - only_published (boolean): Chỉ lấy sản phẩm đã được duyệt để trưng bày + bán (tuỳ chọn)
export const getExhibitionProductsByContract = (contractId, params = {}) =>
  axiosClient.get(`/exhibition-space-products/by-contract/${contractId}`, {
    params,
  });
