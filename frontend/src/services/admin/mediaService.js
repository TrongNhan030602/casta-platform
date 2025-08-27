import axiosClient from "@/services/shared/axiosClient";

// ============================= Media ===========================================

// 📌 1. Lấy danh sách media (có filter, phân trang)
export const getMediaList = (params = {}) =>
  axiosClient.get("/media", { params });

// 📌 2. Lấy chi tiết media theo ID
export const getMediaById = (id) => axiosClient.get(`/media/${id}`);

// 📌 3. Upload file mới
export const uploadMedia = (file, meta = {}) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("meta", JSON.stringify(meta));
  return axiosClient.post("/media", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 📌 4. Cập nhật media
export const updateMedia = (id, data) => axiosClient.put(`/media/${id}`, data);

// 📌 5. Xóa mềm media
export const deleteMedia = (id) => axiosClient.delete(`/media/${id}`);

// 📌 6. Khôi phục media đã xóa mềm
export const restoreMedia = (id) => axiosClient.patch(`/media/${id}/restore`);

// 📌 7. Xóa vĩnh viễn media
export const forceDeleteMedia = (id) =>
  axiosClient.delete(`/media/${id}/force`);

// 📌 8. Gán media vào model (post, service…)
export const attachMedia = (data) => axiosClient.post("/media/attach", data); // data: { model_type, model_id, media_id, role }

// 📌 9. Gỡ media khỏi model
export const detachMedia = (data) => axiosClient.post("/media/detach", data); // data: { model_type, model_id, media_id }
