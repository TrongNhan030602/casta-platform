import * as yup from "yup";
import { confirmPasswordSchema, passwordSchema } from "@/validations/shared";

/**
 * Schema cho đổi mật khẩu (đã đăng nhập)
 */
export const changePasswordSchema = yup.object().shape({
  current_password: passwordSchema.label("Mật khẩu hiện tại"),
  new_password: passwordSchema.label("Mật khẩu mới"),
  new_password_confirmation: confirmPasswordSchema("new_password").label(
    "Xác nhận mật khẩu mới"
  ),
});
