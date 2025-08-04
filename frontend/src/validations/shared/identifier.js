import * as yup from "yup";

export const identifierSchema = yup
  .string()
  .required("Vui lòng nhập tài khoản hoặc email.")
  .test(
    "is-username-or-email",
    "Tài khoản hoặc email không hợp lệ.",
    (value) => {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-ZÀ-ỹ0-9_.-]+$/u;
      return emailRegex.test(value) || usernameRegex.test(value);
    }
  );
