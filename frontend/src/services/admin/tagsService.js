import axiosClient from "@/services/shared/axiosClient";

// ============================= Tags ===========================================

// 📌 1. Lấy danh sách tags (có filter nếu muốn)
export const getTagList = (params = {}) => axiosClient.get("/tags", { params });

// 📌 2. Tạo mới tag
export const createTag = (data) => axiosClient.post("/tags", data);

// 📌 3. Lấy chi tiết tag theo ID
export const getTagById = (id) => axiosClient.get(`/tags/${id}`);

// 📌 4. Cập nhật tag
export const updateTag = (id, data) => axiosClient.put(`/tags/${id}`, data);

// 📌 5. Xóa mềm tag
export const deleteTag = (id) => axiosClient.delete(`/tags/${id}`);

// 📌 6. Khôi phục tag đã xóa mềm
export const restoreTag = (id) => axiosClient.patch(`/tags/${id}/restore`);

// 📌 7. Xóa vĩnh viễn tag
export const forceDeleteTag = (id) => axiosClient.delete(`/tags/${id}/force`);

// 📌 8. Gắn tag vào model bất kỳ (Post / Service)
export const attachTags = (type, id, tagIds = []) =>
  axiosClient.post(`/tags/attach/${type}/${id}`, { tags: tagIds });

// 📌 9. Gỡ tag khỏi model
export const detachTags = (type, id, tagIds = []) =>
  axiosClient.post(`/tags/detach/${type}/${id}`, { tags: tagIds });
