import * as yup from "yup";

export const usernameSchema = yup
  .string()
  .required("Vui lòng nhập tên đăng nhập.")
  .min(3, "Tên phải từ 3 ký tự trở lên.")
  .max(50, "Tên không vượt quá 50 ký tự.")
  .matches(
    /^[a-zA-ZÀ-ỹ0-9_.-]+$/u,
    "Tên đăng nhập chỉ được chứa chữ cái, số, dấu gạch dưới hoặc gạch ngang."
  )
  .test(
    "not-email",
    "Tên đăng nhập không được giống định dạng email.",
    (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value);
    }
  );
