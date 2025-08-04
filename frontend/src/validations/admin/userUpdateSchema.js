// validations/admin/userUpdateSchema.js
import * as yup from "yup";
import { usernameSchema, emailSchema } from "@/validations/shared";

export const updateUserSchema = yup.object().shape({
  name: usernameSchema.label("Tên đăng nhập"),
  email: emailSchema.label("Email"),

  // KHÔNG khai báo password nếu không dùng
  // role không bắt buộc, chỉ cần nếu bạn cho phép thay đổi
  role: yup.string().notRequired(),

  enterprise_id: yup
    .string()
    .nullable()
    .when("role", {
      is: "nvdn",
      then: (schema) => schema.required("Vui lòng chọn doanh nghiệp"),
    }),
});
