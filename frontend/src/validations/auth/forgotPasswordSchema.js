import * as yup from "yup";
import { emailSchema } from "@/validations/shared";

/**
 * Schema cho form Quên mật khẩu
 */
export const forgotPasswordSchema = yup.object().shape({
  email: emailSchema.label("Email"),
});
