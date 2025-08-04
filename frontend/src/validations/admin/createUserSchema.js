// validations/admin/userCreateSchema.js
import * as yup from "yup";
import {
  usernameSchema,
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
} from "@/validations/shared";

export const createUserSchema = yup.object().shape({
  name: usernameSchema.label("Tên đăng nhập"),
  email: emailSchema.label("Email"),
  password: passwordSchema.label("Mật khẩu").required("Vui lòng nhập mật khẩu"),
  password_confirmation: confirmPasswordSchema("password")
    .label("Xác nhận mật khẩu")
    .required("Vui lòng xác nhận mật khẩu"),
  role: yup.string().required("Vui lòng chọn vai trò"),
  enterprise_id: yup
    .string()
    .nullable()
    .when("role", {
      is: "nvdn",
      then: (schema) => schema.required("Vui lòng chọn doanh nghiệp"),
    }),
});
