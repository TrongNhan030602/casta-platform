import * as yup from "yup";

export const emailSchema = yup
  .string()
  .required("Vui lòng nhập email.")
  .email("Email không hợp lệ.");
