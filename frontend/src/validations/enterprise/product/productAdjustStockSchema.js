import * as yup from "yup";

export const productAdjustStockSchema = yup.object().shape({
  type: yup.string().required("Bắt buộc"),
  quantity: yup
    .number()
    .required("Bắt buộc")
    .integer("Phải là số nguyên")
    .positive("Phải lớn hơn 0"),
  unit_price: yup
    .number()
    .nullable()
    .transform((value, origin) => (origin === "" ? null : value))
    .when(["type", "affect_cost"], {
      is: (type, affect_cost) =>
        ["import", "return_sale"].includes(type) ||
        (type === "adjust_increase" && affect_cost),
      then: (schema) =>
        schema.required("Bắt buộc khi ảnh hưởng giá vốn").min(0, "Phải ≥ 0"),
      otherwise: (schema) => schema.notRequired().nullable(true),
    }),
  affect_cost: yup
    .boolean()
    .default(false)
    .when("type", {
      is: (type) => ["adjust_increase", "adjust_decrease"].includes(type),
      then: (schema) => schema.default(false),
      otherwise: (schema) => schema.strip(),
    }),
  note: yup.string().required("Bắt buộc"),
});
