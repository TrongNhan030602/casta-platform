import axiosClient from "@/services/shared/axiosClient";

// 📌 1. Lấy danh sách sản phẩm (có phân trang, filter)
export const getProductList = (params = {}) =>
  axiosClient.get("/products", { params }); //{ deleted: 'all/only/none' }
// 📌 2. Tạo sản phẩm mới
export const createProduct = (data) => axiosClient.post("/products", data);

// 📌 3. Cập nhật sản phẩm
export const updateProduct = (productId, data) =>
  axiosClient.put(`/products/${productId}`, data);

// 📌 4. Xóa sản phẩm (dành cho DN hoặc QTHT)
export const deleteProduct = (productId, params = {}) =>
  axiosClient.delete(`/products/${productId}`, { params }); //force=true nếu muốn xoá vĩnh viễn

// 📌 Khôi phục sản phẩm đã xoá (QTHT, admin)
export const adminRestoreProduct = (productId) =>
  axiosClient.post(`/products/${productId}/restore`);
// 📌 Lấy chi tiết sản phẩm (không tăng views)
export const getAdminProductDetail = (productId) =>
  axiosClient.get(`/products/${productId}`);

// 📌 5. Cập nhật trạng thái sản phẩm (duyệt, từ chối – dành cho QTHT)
export const updateProductStatus = (productId, data) =>
  axiosClient.put(`/admin/products/${productId}/status`, data);

// 📌 6. Tạo sản phẩm (dành cho QTHT, công khai)
export const adminCreateProduct = (data) =>
  axiosClient.post("/admin/products", data);

// 📌 7. Cập nhật sản phẩm (dành cho QTHT)
export const adminUpdateProduct = (productId, data) =>
  axiosClient.put(`/admin/products/${productId}`, data);

// 📌 Upload ảnh sản phẩm (QTHT, admin) – có thể dùng chung với trên nếu cùng route
export const adminUploadProductImage = (productId, data) =>
  axiosClient.post(`/products/${productId}/images`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 📌 Đặt ảnh làm ảnh đại diện (DN hoặc QTHT)
export const setMainProductImage = (productId, imageId) =>
  axiosClient.put(`/products/${productId}/images/${imageId}/main`);

// 📌 Đặt ảnh làm ảnh đại diện (QTHT, admin)
export const adminSetMainProductImage = (productId, imageId) =>
  axiosClient.put(`/admin/products/${productId}/images/${imageId}/main`);

// 📌 Xóa ảnh khỏi sản phẩm (DN hoặc QTHT)
export const deleteProductImage = (productId, imageId) =>
  axiosClient.delete(`/products/${productId}/images/${imageId}`);

// 📌 Xóa ảnh khỏi sản phẩm (QTHT, admin)
export const adminDeleteProductImage = (productId, imageId) =>
  axiosClient.delete(`/admin/products/${productId}/images/${imageId}`);
