import * as yup from "yup";

/**
 * Schema cập nhật thông tin doanh nghiệp (enterprise profile)
 */
export const profileSchema = yup.object().shape({
  company_name: yup
    .string()
    .max(255, "Tên doanh nghiệp không được vượt quá 255 ký tự.")
    .nullable()
    .label("Tên doanh nghiệp"),

  tax_code: yup
    .string()
    .max(100, "Mã số thuế không được vượt quá 100 ký tự.")
    .nullable()
    .label("Mã số thuế"),

  business_field: yup.string().nullable().label("Lĩnh vực kinh doanh"),

  district: yup
    .string()
    .max(100, "Quận/Huyện không được vượt quá 100 ký tự.")
    .nullable()
    .label("Quận/Huyện"),

  address: yup.string().nullable().label("Địa chỉ"),

  representative: yup
    .string()
    .max(100, "Người đại diện không được vượt quá 100 ký tự.")
    .nullable()
    .label("Người đại diện"),

  phone: yup
    .string()
    .max(20, "Số điện thoại không được vượt quá 20 ký tự.")
    .matches(/^(\+84|0)[1-9][0-9]{8,9}$/, {
      message: "Số điện thoại không đúng định dạng.",
      excludeEmptyString: true,
    })
    .nullable()
    .label("Số điện thoại"),

  email: yup
    .string()
    .email("Email không hợp lệ.")
    .max(255, "Email không được vượt quá 255 ký tự.")
    .nullable()
    .label("Email"),

  website: yup
    .string()
    .url("Website phải đúng định dạng URL.")
    .max(255, "Website không được vượt quá 255 ký tự.")
    .nullable()
    .label("Website"),

  logo_url: yup
    .string()
    .url("Logo phải đúng định dạng URL.")
    .max(255, "Logo không được vượt quá 255 ký tự.")
    .nullable()
    .label("Logo"),

  documents: yup
    .array()
    .of(yup.string().url("Tài liệu phải là đường dẫn hợp lệ."))
    .nullable()
    .label("Danh sách tài liệu"),
});
