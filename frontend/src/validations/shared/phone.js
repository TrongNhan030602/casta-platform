import * as yup from "yup";

export const phoneSchema = yup
  .string()
  .required("Vui lòng nhập số điện thoại.")
  .matches(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ.");
