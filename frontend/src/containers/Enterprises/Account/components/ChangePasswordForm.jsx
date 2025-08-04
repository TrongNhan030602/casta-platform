import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { changePassword } from "@/services/shared/authService";
import { changePasswordSchema } from "@/validations/auth/changePasswordSchema";
import Button from "@/components/common/Button";
import FormGroup from "@/components/common/FormGroup";

const ChangePasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      await changePassword(data);
      toast.success("Đổi mật khẩu thành công");
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="account-card">
      <h3 className="account-card__title">Đổi mật khẩu</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="account-card__form"
      >
        <FormGroup
          id="current_password"
          label="Mật khẩu hiện tại"
          type="password"
          showToggle
          {...register("current_password", {
            onBlur: () => trigger("current_password"),
          })}
          error={errors.current_password?.message}
        />

        <FormGroup
          id="new_password"
          label="Mật khẩu mới"
          type="password"
          showToggle
          {...register("new_password", {
            onBlur: () => trigger("new_password"),
          })}
          error={errors.new_password?.message}
        />

        <FormGroup
          id="new_password_confirmation"
          label="Xác nhận mật khẩu mới"
          type="password"
          showToggle
          {...register("new_password_confirmation", {
            onBlur: () => trigger("new_password_confirmation"),
          })}
          error={errors.new_password_confirmation?.message}
        />

        <Button
          type="submit"
          variant="primary"
          full
          className="account-card__submit"
        >
          Xác nhận
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
