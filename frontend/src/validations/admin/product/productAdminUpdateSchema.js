import * as yup from "yup";
import { PRODUCT_STATUSES } from "@/constants/productStatus";
import { SHIPPING_TYPES } from "@/constants/shippingType";
import { PRODUCT_TAGS } from "@/constants/productTag";
// Đồng bộ Enum với BE
const SHIPPING_TYPE = Object.keys(SHIPPING_TYPES); // ["calculated", "free", "pickup"]
const PRODUCT_TAG = Object.keys(PRODUCT_TAGS); // ["hot", "new", "sale", "limited"]
const PRODUCT_STATUS = Object.keys(PRODUCT_STATUSES); // ["draft", "pending", "published", "rejected", "disabled"]

export const productAdminUpdateSchema = yup.object().shape({
  enterprise_id: yup
    .string()
    .nullable()
    .notRequired()
    .test(
      "not-empty",
      "Doanh nghiệp không hợp lệ",
      (value) => value === null || value !== ""
    ),

  category_id: yup
    .string()
    .nullable()
    .notRequired()
    .test(
      "not-empty",
      "Danh mục không hợp lệ",
      (value) => value === null || value !== ""
    ),

  name: yup
    .string()
    .nullable()
    .notRequired()
    .max(255, "Tên sản phẩm tối đa 255 ký tự"),

  description: yup.string().nullable(),

  price: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Giá phải là số")
    .min(0, "Giá phải lớn hơn hoặc bằng 0"),

  status: yup
    .string()
    .nullable()
    .oneOf(PRODUCT_STATUS, "Trạng thái không hợp lệ"),

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
      "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
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
    .typeError("Khối lượng phải là số")
    .min(0, "Khối lượng phải ≥ 0"),

  dimensions: yup.object().shape({
    width: yup
      .number()
      .nullable()
      .typeError("Chiều rộng phải là số")
      .min(0, "Chiều rộng phải ≥ 0"),

    height: yup
      .number()
      .nullable()
      .typeError("Chiều cao phải là số")
      .min(0, "Chiều cao phải ≥ 0"),

    depth: yup
      .number()
      .nullable()
      .typeError("Chiều sâu phải là số")
      .min(0, "Chiều sâu phải ≥ 0"),
  }),

  shipping_type: yup
    .string()
    .nullable()
    .oneOf(SHIPPING_TYPE, "Phương thức giao hàng không hợp lệ"),

  views_count: yup
    .number()
    .nullable()
    .typeError("Lượt xem phải là số")
    .min(0, "Lượt xem phải ≥ 0"),

  purchased_count: yup
    .number()
    .nullable()
    .typeError("Lượt mua phải là số")
    .min(0, "Lượt mua phải ≥ 0"),

  reviews_count: yup
    .number()
    .nullable()
    .typeError("Lượt đánh giá phải là số")
    .min(0, "Lượt đánh giá phải ≥ 0"),

  average_rating: yup
    .number()
    .nullable()
    .typeError("Điểm đánh giá phải là số")
    .min(0, "Điểm đánh giá phải từ 0 đến 5")
    .max(5, "Điểm đánh giá phải từ 0 đến 5"),

  model_3d_url: yup.string().nullable().url("Link mô hình 3D không hợp lệ"),

  video_url: yup.string().nullable().url("Link video không hợp lệ"),

  tags: yup
    .array()
    .nullable()
    .of(yup.string().oneOf(PRODUCT_TAG, "Tag không hợp lệ")),
});
