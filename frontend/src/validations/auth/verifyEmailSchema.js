import * as yup from "yup";
import { emailSchema } from "@/validations/shared";

/**
 * Schema cho gửi lại email xác thực
 */
export const verifyEmailSchema = yup.object().shape({
  email: emailSchema.label("Email"),
});
