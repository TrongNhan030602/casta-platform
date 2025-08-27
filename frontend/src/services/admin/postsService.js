import axiosClient from "@/services/shared/axiosClient";

// ============================= Bài viết ===========================================

// 1. Lấy danh sách bài viết
export const getPostList = (params = {}) =>
  axiosClient.get("/posts", { params });
// 2. Tạo mới bài viết (hỗ trợ file)
export const createPost = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(`${key}[]`, v)); // array field
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return axiosClient.post("/posts", formData); // Axios tự set Content-Type
};

// 3. Cập nhật bài viết (hỗ trợ file)
export const updatePost = (postId, data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(`${key}[]`, v));
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return axiosClient.put(`/posts/${postId}`, formData); // Axios tự set Content-Type
};

// 4. Xóa mềm bài viết
export const deletePost = (postId, params = {}) =>
  axiosClient.delete(`/posts/${postId}`, { params });

// 5. Lấy chi tiết bài viết theo ID
export const getPostById = (postId) => axiosClient.get(`/posts/${postId}`);

// 6. Khôi phục bài viết đã xóa mềm
export const restorePost = (postId, params = {}) =>
  axiosClient.patch(`/posts/${postId}/restore`, { params });

// 7. Xóa vĩnh viễn bài viết
export const forceDeletePost = (postId, params = {}) =>
  axiosClient.delete(`/posts/${postId}/force-delete`, { params });
