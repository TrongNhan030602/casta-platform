// @/validations/admin/productCategory/productCategoryBaseSchema.js
import * as yup from "yup";

export const productCategoryBaseSchema = yup.object({
  name: yup
    .string()
    .required("Tên danh mục là bắt buộc")
    .max(255, "Tối đa 255 ký tự"),

  description: yup.string().nullable(),

  parent_id: yup
    .mixed()
    .nullable()
    .test("is-valid", "Danh mục cha không hợp lệ", (val) => {
      return val === "" || val === null || !isNaN(Number(val));
    }),

  sort_order: yup
    .number()
    .typeError("Thứ tự phải là số")
    .nullable()
    .integer("Thứ tự phải là số nguyên"),

  is_active: yup.boolean(),
});
