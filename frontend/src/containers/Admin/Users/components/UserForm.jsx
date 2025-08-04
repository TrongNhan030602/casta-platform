import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import FormGroup from "@/components/common/FormGroup";
import Button from "@/components/common/Button";
import SelectBox from "@/components/common/SelectBox";

import { roleLabelMap } from "@/utils/roles";
import { createUserSchema } from "@/validations/admin/createUserSchema";
import { updateUserSchema } from "@/validations/admin/userUpdateSchema";
import { getApprovedEnterprises } from "@/services/admin/enterpriseService";
import { toast } from "react-toastify";

const roleOptions = Object.entries(roleLabelMap).map(([value, label]) => ({
  value,
  label,
}));

const UserForm = ({
  defaultValues = {},
  onSubmit,
  isEdit = false,
  loading = false,
}) => {
  const schema = isEdit ? updateUserSchema : createUserSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "",
      enterprise_id: "",
      ...defaultValues,
    },
    resolver: yupResolver(schema),
  });

  const role = watch("role");
  const enterpriseId = watch("enterprise_id");

  const [enterpriseOptions, setEnterpriseOptions] = useState([]);

  useEffect(() => {
    const shouldLoadEnterprises =
      role === "nvdn" || (isEdit && defaultValues.role === "nvdn");

    if (shouldLoadEnterprises && enterpriseOptions.length === 0) {
      getApprovedEnterprises()
        .then((res) => {
          const options = res.data?.data.map((e) => ({
            value: String(e.id),
            label: e.company_name,
          }));
          setEnterpriseOptions(options);
        })
        .catch(() => toast.error("Không thể tải danh sách doanh nghiệp"));
    }
  }, [role, isEdit, defaultValues.role, enterpriseOptions.length]);

  return (
    <form
      onSubmit={handleSubmit(
        (data) => {
          onSubmit(data, { setError });
        },
        (error) => {
          console.log("❌ Validation error:", error);
        }
      )}
    >
      <FormGroup
        id="name"
        label="Tên đăng nhập"
        error={errors.name?.message}
        {...register("name")}
      />

      <FormGroup
        id="email"
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />

      {!isEdit && (
        <>
          <FormGroup
            id="password"
            label="Mật khẩu"
            type="password"
            showToggle
            error={errors.password?.message}
            {...register("password")}
          />
          <FormGroup
            id="password_confirmation"
            label="Xác nhận mật khẩu"
            type="password"
            showToggle
            error={errors.password_confirmation?.message}
            {...register("password_confirmation")}
          />
        </>
      )}

      {!isEdit && (
        <SelectBox
          id="role"
          label="Vai trò"
          value={role}
          onChange={(value) => setValue("role", value)}
          options={roleOptions}
          error={errors.role?.message}
          menuPlacement="top"
        />
      )}

      {role === "nvdn" && (
        <SelectBox
          id="enterprise_id"
          label="Doanh nghiệp"
          value={enterpriseId}
          onChange={(value) => setValue("enterprise_id", value)}
          options={enterpriseOptions}
          error={errors.enterprise_id?.message}
          menuPlacement="top"
        />
      )}

      <div style={{ marginTop: 20 }}>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
