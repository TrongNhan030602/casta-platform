import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaLock, FaKey } from "react-icons/fa";

import { changePasswordSchema } from "@/validations/auth/changePasswordSchema";
import { changePassword } from "@/services/shared/authService";
import Button from "@/components/common/Button";
import FormGroup from "@/components/common/FormGroup";
import { toast } from "react-toastify";
import "@/assets/styles/layout/admin/account/change-password-page.css";

const ChangePasswordPage = () => {
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
      toast.success("Đổi mật khẩu thành công!");
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <div className="change-password-page">
      <h2 className="change-password-page__title">Đổi mật khẩu</h2>
      <form
        className="change-password-page__form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup
          label="Mật khẩu hiện tại"
          icon={<FaKey />}
          type="password"
          showToggle
          {...register("current_password", {
            onBlur: () => trigger("current_password"),
          })}
          error={errors.current_password?.message}
        />
        <FormGroup
          label="Mật khẩu mới"
          type="password"
          icon={<FaLock />}
          showToggle
          {...register("new_password", {
            onBlur: () => trigger("new_password"),
          })}
          error={errors.new_password?.message}
        />

        <FormGroup
          label="Xác nhận mật khẩu mới"
          icon={<FaLock />}
          type="password"
          {...register("new_password_confirmation", {
            onBlur: () => trigger("new_password_confirmation"),
          })}
          error={errors.new_password_confirmation?.message}
        />

        <Button type="submit">Đổi mật khẩu</Button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
