import * as yup from "yup";

export const confirmPasswordSchema = (refField = "password") =>
  yup
    .string()
    .required("Vui lòng nhập lại mật khẩu.")
    .oneOf([yup.ref(refField)], "Mật khẩu xác nhận không khớp.");
