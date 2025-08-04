import axiosClient from "@/services/shared/axiosClient";

// ==========================
// 🏢 ADMIN - EXHIBITION SPACES
// ==========================

// 1. Danh mục không gian trưng bày

// 📌 Lấy danh sách danh mục
export const getExhibitionSpaceCategories = (params = {}) =>
  axiosClient.get("/exhibition-space-categories", { params });

// 📌 Lấy danh mục dạng cây (tree)
export const getExhibitionSpaceCategoryTree = () =>
  axiosClient.get("/exhibition-space-categories/tree");
// 📌 Lấy chi tiết danh mục
export const getExhibitionSpaceCategoryById = (id) =>
  axiosClient.get(`/exhibition-space-categories/${id}`);

// 📌 Tạo mới danh mục
export const createExhibitionSpaceCategory = (data) =>
  axiosClient.post("/exhibition-space-categories", data);

// 📌 Cập nhật danh mục
export const updateExhibitionSpaceCategory = (categoryId, data) =>
  axiosClient.put(`/exhibition-space-categories/${categoryId}`, data);

// 📌 Xoá danh mục
export const deleteExhibitionSpaceCategory = (categoryId) =>
  axiosClient.delete(`/exhibition-space-categories/${categoryId}`);

// 2. Không gian trưng bày

// 📌 Lấy danh sách không gian
export const getExhibitionSpaces = (params = {}) =>
  axiosClient.get("/exhibition-spaces", { params });

// 📌 Lấy chi tiết không gian
export const getExhibitionSpaceById = (id) =>
  axiosClient.get(`/exhibition-spaces/${id}`);

// 📌 Lấy danh sách không gian để chọn (id, code, name)
export const getSelectableExhibitionSpaces = () =>
  axiosClient.get("/exhibition-spaces/selectable");

// 📌 Tạo mới không gian
export const createExhibitionSpace = (data) =>
  axiosClient.post("/exhibition-spaces", data);

// 📌 Cập nhật không gian
export const updateExhibitionSpace = (spaceId, data) =>
  axiosClient.put(`/exhibition-spaces/${spaceId}`, data);

// 📌 Đổi trạng thái không gian (trống, đang sử dụng, bảo trì)
export const updateExhibitionSpaceStatus = (spaceId, data) =>
  axiosClient.patch(`/exhibition-spaces/${spaceId}/status`, data);

// 📌 Xoá không gian
export const deleteExhibitionSpace = (spaceId) =>
  axiosClient.delete(`/exhibition-spaces/${spaceId}`);

// 📌 Danh sách doanh nghiệp đang thuê không gian
export const getEnterprisesInSpace = (spaceId) =>
  axiosClient.get(`/exhibition-spaces/${spaceId}/enterprises`);

// 3. Tài liệu
//  Upload media (ảnh 360, video, tài liệu) cho không gian trưng bày
export const uploadExhibitionSpaceMedia = (spaceId, data) =>
  axiosClient.post(`/exhibition-spaces/${spaceId}/media/upload`, data, {
    headers: {
      "Content-Type": "multipart/form-data", // Cần gửi dữ liệu file
    },
  });

// Cập nhật media (file, caption, thứ tự...) của không gian
export const updateExhibitionSpaceMedia = (spaceId, mediaId, data) =>
  axiosClient.post(
    `/exhibition-spaces/${spaceId}/media/${mediaId}/update`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

//  Xoá media khỏi không gian (kèm xoá file lưu trữ)
export const deleteExhibitionSpaceMedia = (spaceId, mediaId) =>
  axiosClient.delete(`/exhibition-spaces/${spaceId}/media/${mediaId}`);
