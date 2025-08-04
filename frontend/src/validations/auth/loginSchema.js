import * as yup from "yup";
import { identifierSchema, passwordSchema } from "@/validations/shared";

/**
 * Schema cho form đăng nhập
 */
export const loginSchema = yup.object().shape({
  identifier: identifierSchema.label("Tài khoản hoặc Email"),
  password: passwordSchema.label("Mật khẩu"),
});
