import axiosClient from "@/services/shared/axiosClient";

// 📌 1. Lấy danh sách danh mục sản phẩm (có phân trang, filter)
export const getCategoryList = (params = {}) =>
  axiosClient.get("/categories", { params });

// 📌 2. Tạo mới danh mục sản phẩm
export const createCategory = (data) => axiosClient.post("/categories", data);

// 📌 3. Cập nhật danh mục sản phẩm
export const updateCategory = (categoryId, data) =>
  axiosClient.patch(`/categories/${categoryId}`, data);

// 📌 4. Xóa danh mục sản phẩm
export const deleteCategory = (categoryId) =>
  axiosClient.delete(`/categories/${categoryId}`);

// 📌 5. Lấy cây danh mục sản phẩm (không phân trang, dạng tree)
export const getCategoryTree = () => axiosClient.get("/categories/tree");

// 📌 6. Lấy chi tiết danh mục sản phẩm theo ID
export const getCategoryById = (categoryId) =>
  axiosClient.get(`/categories/${categoryId}`);
