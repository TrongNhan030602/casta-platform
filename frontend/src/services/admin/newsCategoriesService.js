//@services\admin\newsCategoriesSevice.js
import axiosClient from "@/services/shared/axiosClient";

// 📌 1. Lấy danh sách danh mục tin tức (có phân trang, filter)
export const getNewsCategoryList = (params = {}) =>
  axiosClient.get("/news-categories", { params });

// 📌 2. Tạo mới danh mục tin tức
export const createNewsCategory = (data) =>
  axiosClient.post("/news-categories", data);

// 📌 3. Cập nhật danh mục tin tức
export const updateNewsCategory = (categoryId, data) =>
  axiosClient.put(`/news-categories/${categoryId}`, data);

// 📌 4. Xóa mềm danh mục tin tức
export const deleteNewsCategory = (categoryId, params = {}) =>
  axiosClient.delete(`/news-categories/${categoryId}`, { params });

// 📌 5. Lấy cây danh mục tin tức (không phân trang, dạng tree)
export const getNewsCategoryTree = () =>
  axiosClient.get("/news-categories/tree");

// 📌 6. Lấy chi tiết danh mục tin tức theo ID
export const getNewsCategoryById = (categoryId) =>
  axiosClient.get(`/news-categories/${categoryId}`);

// 📌 7. Khôi phục danh mục tin tức đã xóa mềm
export const restoreNewsCategory = (categoryId, params = {}) =>
  axiosClient.patch(`/news-categories/${categoryId}/restore`, { params });

// 📌 8. Xóa vĩnh viễn danh mục tin tức
export const forceDeleteNewsCategory = (categoryId, params = {}) =>
  axiosClient.delete(`/news-categories/${categoryId}/force-delete`, { params });
