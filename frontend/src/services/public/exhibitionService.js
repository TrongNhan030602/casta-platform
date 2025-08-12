import axiosClient from "@/services/shared/axiosClient";

// ===============================
// 🌐 PUBLIC - EXHIBITION
// ===============================

/**
 * 📌 Lấy thông tin trưng bày công khai theo slug
 * @param {string} slug - Slug của exhibition (ví dụ: "exhibition-16-7k8q7r")
 * @returns {Promise}
 */
export const getPublicExhibitionBySlug = (slug) =>
  axiosClient.get(`/public/exhibitions/${slug}`);
