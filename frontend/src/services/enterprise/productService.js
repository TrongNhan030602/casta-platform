import axiosClient from "@/services/shared/axiosClient";

//
// ========== DANH MỤC SẢN PHẨM ==========
//

// 📌 Lấy danh sách danh mục sản phẩm (dạng phẳng)
export const getProductCategories = (params = {}) =>
  axiosClient.get("/categories", { params }); // is_active = 1 (nếu là doanh nghiệp)

// 📌 Lấy danh sách danh mục sản phẩm dạng cây
export const getProductCategoryTree = () => axiosClient.get("/categories/tree");

//
// ========== SẢN PHẨM DOANH NGHIỆP ==========
//

// 📌 Lấy danh sách sản phẩm của doanh nghiệp (phân trang, filter)
// Bổ sung `deleted` param khi gọi
export const getEnterpriseProductList = (params = {}) =>
  axiosClient.get("/products", { params }); // params.deleted = 'only' | 'none' | 'all'

// 📌 Lấy danh sách sản phẩm compact của doanh nghiệp
export const getEnterpriseCompactProducts = () =>
  axiosClient.get("/products/compact");

// 📌 Tạo sản phẩm mới (doanh nghiệp)
export const createEnterpriseProduct = (data) =>
  axiosClient.post("/products", data);

// 📌 Gửi sản phẩm từ trạng thái DRAFT → PENDING (doanh nghiệp)
export const submitEnterpriseProduct = (productId) =>
  axiosClient.post(`/products/${productId}/submit`);

// 📌 Doanh nghiệp cập nhật trạng thái sản phẩm (chỉ cho phép draft, pending, disabled)
export const updateEnterpriseProductStatus = (productId, data) =>
  axiosClient.put(`/products/${productId}/status`, data);

// 📌 Lấy chi tiết sản phẩm (doanh nghiệp, không tăng views)
export const getEnterpriseProductDetail = (productId) =>
  axiosClient.get(`/products/${productId}`);

// 📌 Cập nhật sản phẩm (doanh nghiệp)
export const updateEnterpriseProduct = (productId, data) =>
  axiosClient.put(`/products/${productId}`, data);

// 📌 Xóa sản phẩm (doanh nghiệp)
export const deleteEnterpriseProduct = (productId, params = {}) =>
  axiosClient.delete(`/products/${productId}`, { params }); //force=true nếu muốn xoá vĩnh viễn

export const restoreEnterpriseProduct = (productId) =>
  axiosClient.post(`/products/${productId}/restore`);

//
// ========== TỒN KHO SẢN PHẨM ==========
//

// 📌 Điều chỉnh tồn kho sản phẩm (doanh nghiệp)
export const adjustProductStock = (productId, data) =>
  axiosClient.post(`/products/${productId}/adjust-stock`, data);

// 📌 Lấy lịch sử tồn kho của sản phẩm
export const getProductStockLogs = (productId, params = {}) =>
  axiosClient.get(`/products/${productId}/stock-logs`, { params });

// 📌 Lấy tồn kho và giá vốn trung bình của sản phẩm
export const getProductStockSummary = (productId) =>
  axiosClient.get(`/products/${productId}/stock-summary`);

//
// ========== ẢNH SẢN PHẨM ==========
//

// 📌 Tải ảnh sản phẩm
export const uploadProductImage = (productId, data) =>
  axiosClient.post(`/products/${productId}/images`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 📌 Đặt ảnh làm ảnh đại diện
export const setMainProductImage = (productId, imageId) =>
  axiosClient.put(`/products/${productId}/images/${imageId}/main`);

// 📌 Xóa ảnh khỏi sản phẩm
export const deleteProductImage = (productId, imageId) =>
  axiosClient.delete(`/products/${productId}/images/${imageId}`);
