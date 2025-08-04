import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import AuthLayout from "@/layout/AuthLayout";
import FormGroup from "@/components/common/FormGroup";
import Button from "@/components/common/Button";
import { FaEnvelope } from "react-icons/fa";

import { sendResetLink } from "@/services/shared/authService";
import { forgotPasswordSchema } from "@/validations/auth/forgotPasswordSchema";

import "react-toastify/dist/ReactToastify.css";
import "@/assets/styles/auth/auth.css";

// ✅ Schema chỉ cần email

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async ({ email }) => {
    try {
      await sendResetLink(email);
      toast.success(
        "Dã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư."
      );
    } catch (err) {
      const msg = err?.response?.data?.message || "Không thể gửi email.";
      toast.error(`${msg}`);
      setError("email", { message: msg });
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form">
        <h2 className="auth-form__title">Quên mật khẩu</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="auth-form__form"
        >
          <FormGroup
            label="Email đã đăng ký"
            icon={<FaEnvelope />}
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Button
            type="submit"
            className="auth-form__button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi email khôi phục"}
          </Button>
        </form>

        <p className="auth-form__message">
          Nhớ mật khẩu?{" "}
          <span
            className="text-link"
            onClick={() => navigate("/login")}
          >
            Quay lại đăng nhập
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
