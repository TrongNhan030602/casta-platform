//@services/public/categoryService.js

import axiosClient from "@/services/shared/axiosClient";

// 📌 Lấy danh mục sản phẩm dạng cây (không cần login)
export const getPublicCategoryTree = () =>
  axiosClient.get("/public/categories/tree");
