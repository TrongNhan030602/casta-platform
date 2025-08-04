import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { FaEnvelope, FaLock } from "react-icons/fa";
import AuthLayout from "@/layout/AuthLayout";
import FormGroup from "@/components/common/FormGroup";
import Button from "@/components/common/Button";
import { resetPassword } from "@/services/shared/authService";
import { resetPasswordSchema } from "@/validations/auth/resetPasswordSchema";

import "@/assets/styles/auth/auth.css";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailFromUrl = searchParams.get("email") || "";
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    setValue("email", emailFromUrl);
  }, [emailFromUrl, setValue]);

  const onSubmit = async (data) => {
    try {
      await resetPassword({ ...data, token });
      alert("✅ Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (err) {
      setError("password", {
        message: err?.response?.data?.message || "❌ Có lỗi xảy ra.",
      });
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form">
        <h2 className="auth-form__title">Đặt lại mật khẩu</h2>
        <form
          className="auth-form__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup
            label="Email"
            icon={<FaEnvelope />}
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <FormGroup
            label="Mật khẩu mới"
            icon={<FaLock />}
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <FormGroup
            label="Nhập lại mật khẩu"
            icon={<FaLock />}
            type="password"
            {...register("password_confirmation")}
            error={errors.password_confirmation?.message}
          />
          <Button className="auth-form__button">Cập nhật mật khẩu</Button>
        </form>

        <p className="auth-form__message">
          <span
            className="text-link"
            onClick={() => navigate("/login")}
          >
            ← Quay lại đăng nhập
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
