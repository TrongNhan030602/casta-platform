import axiosClient from "@/services/shared/axiosClient";

/**
 * Upload tài liệu (DN chính)
 */
export const uploadEnterpriseDocuments = (id, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("documents[]", file));
  return axiosClient.post(`/enterprises/${id}/upload-documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Mở tài liệu (PDF/image) trong tab mới – dùng cho file private (qua JWT)
 */
export const openEnterpriseDocument = async (enterpriseId, filename) => {
  try {
    const res = await axiosClient.get(
      `/enterprises/${enterpriseId}/documents/${encodeURIComponent(filename)}`,
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], {
      type: res.headers["content-type"] || "application/octet-stream",
    });

    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, "_blank");

    // Thu hồi URL khi không còn dùng (tối ưu bộ nhớ)
    win?.addEventListener("load", () => URL.revokeObjectURL(blobUrl));
  } catch (err) {
    console.error("Mở tài liệu lỗi:", err);
    alert("Không thể mở tài liệu. Có thể thiếu quyền hoặc file không tồn tại.");
  }
};

export const downloadEnterpriseDocument = async (
  enterpriseId,
  filename,
  originalName
) => {
  try {
    const res = await axiosClient.get(
      `/enterprises/${enterpriseId}/documents/${encodeURIComponent(filename)}`,
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], {
      type: res.headers["content-type"] || "application/octet-stream",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Dùng tên gốc (original_name) nếu có
    link.download = originalName || filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Tải file lỗi:", err);
  }
};

/**
 * Lấy chi tiết doanh nghiệp theo ID profile
 */
export const getEnterpriseById = (id) => {
  return axiosClient.get(`/enterprises/${id}`);
};

/**
 * Xoá tài liệu (DN chính)
 */
export const deleteEnterpriseDocument = (id, filename) =>
  axiosClient.delete(`/enterprises/${id}/documents/${filename}`);
/**
 * Cập nhật hồ sơ doanh nghiệp (chỉ dành cho doanh nghiệp chính)
 */
export const updateEnterprise = (id, data) => {
  return axiosClient.put(`/enterprises/${id}`, data);
};

//  Lấy cảnh báo của chính mình
export const getMyViolations = () => {
  return axiosClient.get("/violations/me");
};
