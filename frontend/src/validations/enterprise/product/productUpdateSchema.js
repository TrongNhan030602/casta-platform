import * as yup from "yup";

import { SHIPPING_TYPES } from "@/constants/shippingType";
import { PRODUCT_TAGS } from "@/constants/productTag";

const SHIPPING_TYPE = Object.keys(SHIPPING_TYPES); // ["calculated", "free", "pickup"]
const PRODUCT_TAG = Object.keys(PRODUCT_TAGS); // ["hot", "new", "sale", "limited"]

export const productUpdateSchema = yup.object().shape({
  category_id: yup
    .string()
    .nullable()
    .notRequired()
    .test("valid-or-null", "Danh mục không hợp lệ", (value) => {
      return value === null || typeof value === "string";
    }),

  name: yup
    .string()
    .nullable()
    .notRequired()
    .max(255, "Tên sản phẩm tối đa 255 ký tự"),

  description: yup.string().nullable().notRequired(),

  price: yup
    .number()
    .nullable()
    .notRequired()
    .typeError("Giá phải là số")
    .min(0, "Giá sản phẩm không được nhỏ hơn 0"),

  discount_price: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Giá khuyến mãi phải là số")
    .min(0, "Giá khuyến mãi phải ≥ 0")
    .test("lt-price", "Giá khuyến mãi phải nhỏ hơn giá gốc", function (value) {
      const { price } = this.parent;
      return value == null || price == null || value < price;
    }),

  discount_start_at: yup
    .date()
    .nullable()
    .typeError("Ngày bắt đầu không hợp lệ"),

  discount_end_at: yup
    .date()
    .nullable()
    .typeError("Ngày kết thúc không hợp lệ")
    .test(
      "after-start",
      "Thời gian kết thúc phải sau hoặc bằng thời gian bắt đầu",
      function (value) {
        const { discount_start_at } = this.parent;
        return (
          !value ||
          !discount_start_at ||
          new Date(value) >= new Date(discount_start_at)
        );
      }
    ),

  weight: yup
    .number()
    .nullable()
    .notRequired()
    .typeError("Khối lượng phải là số")
    .min(0, "Khối lượng phải ≥ 0"),

  dimensions: yup.object().shape({
    width: yup
      .number()
      .nullable()
      .notRequired()
      .typeError("Chiều rộng phải là số")
      .min(0, "Chiều rộng phải ≥ 0"),

    height: yup
      .number()
      .nullable()
      .notRequired()
      .typeError("Chiều cao phải là số")
      .min(0, "Chiều cao phải ≥ 0"),

    depth: yup
      .number()
      .nullable()
      .notRequired()
      .typeError("Chiều sâu phải là số")
      .min(0, "Chiều sâu phải ≥ 0"),
  }),

  shipping_type: yup
    .string()
    .nullable()
    .notRequired()
    .oneOf(SHIPPING_TYPE, "Phương thức giao hàng không hợp lệ"),

  model_3d_url: yup
    .string()
    .nullable()
    .notRequired()
    .url("Link mô hình 3D không hợp lệ"),

  video_url: yup
    .string()
    .nullable()
    .notRequired()
    .url("Link video không hợp lệ"),

  tags: yup
    .array()
    .nullable()
    .notRequired()
    .of(yup.string().oneOf(PRODUCT_TAG)),
});
