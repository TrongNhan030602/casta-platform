import * as yup from "yup";

/**
 * Schema cập nhật thông tin khách hàng (customer)
 */
export const profileSchema = yup.object().shape({
  name: yup
    .string()
    .max(255, "Tên khách hàng không được vượt quá 255 ký tự.")
    .nullable()
    .label("Tên khách hàng"),

  phone: yup
    .string()
    .max(20, "Số điện thoại không được vượt quá 20 ký tự.")
    .nullable()
    .label("Số điện thoại"),

  address: yup
    .string()
    .max(255, "Địa chỉ không được vượt quá 255 ký tự.")
    .nullable()
    .label("Địa chỉ"),

  gender: yup
    .string()
    .oneOf(["male", "female", "other"], "Giới tính không hợp lệ.")
    .nullable()
    .label("Giới tính"),

  dob: yup
    .date()
    .nullable()
    .typeError("Ngày sinh không hợp lệ.")
    .max(new Date(), "Ngày sinh phải nhỏ hơn ngày hiện tại.")
    .label("Ngày sinh"),
});
