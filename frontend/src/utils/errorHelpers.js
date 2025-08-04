/**
 * Trích xuất lỗi từ Axios Error dựa trên field cụ thể
 */
export function extractFieldError(error, fieldKey) {
  return (
    error?.response?.data?.errors?.[fieldKey]?.[0] ||
    error?.response?.data?.message ||
    error?.message ||
    "Đã xảy ra lỗi không xác định."
  );
}

/**
 * Trích xuất toàn bộ lỗi field từ Axios error
 * Trả về object: { field1: "msg", field2: "msg" }
 */
export function extractFieldErrors(error) {
  const errors = {};
  const errorData = error?.response?.data?.errors;

  if (errorData && typeof errorData === "object") {
    Object.entries(errorData).forEach(([key, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        errors[key] = messages[0];
      }
    });
  }

  return errors;
}
