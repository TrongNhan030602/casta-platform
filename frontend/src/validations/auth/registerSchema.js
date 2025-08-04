import * as yup from "yup";
import {
  usernameSchema,
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
} from "@/validations/shared";

/**
 * Schema dùng chung cho đăng ký khách hàng hoặc doanh nghiệp (hiện tại)
 */
export const registerSchema = yup.object().shape({
  name: usernameSchema.label("Tên đăng nhập"),
  email: emailSchema.label("Email"),
  password: passwordSchema.label("Mật khẩu"),
  password_confirmation:
    confirmPasswordSchema("password").label("Xác nhận mật khẩu"),
});
