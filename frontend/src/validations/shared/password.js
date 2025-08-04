import * as yup from "yup";

export const passwordSchema = yup
  .string()
  .required("Vui lòng nhập mật khẩu.")
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
  .matches(/[A-Z]/, "Phải có ít nhất 1 chữ in hoa.")
  .matches(/[a-z]/, "Phải có ít nhất 1 chữ thường.")
  .matches(/[0-9]/, "Phải có ít nhất 1 chữ số.")
  .matches(/[@$!%*#?&]/, "Phải có ít nhất 1 ký tự đặc biệt.");
