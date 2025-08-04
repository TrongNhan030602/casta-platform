import * as yup from "yup";
import {
  confirmPasswordSchema,
  emailSchema,
  passwordSchema,
} from "@/validations/shared";

/**
 * Schema cho form Đặt lại mật khẩu
 */
export const resetPasswordSchema = yup.object().shape({
  email: emailSchema.label("Email"),
  password: passwordSchema.label("Mật khẩu mới"),
  password_confirmation:
    confirmPasswordSchema("password").label("Xác nhận mật khẩu"),
});
