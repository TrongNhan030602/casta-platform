import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { login } from "@/redux/slices/authSlice";
import { loginSchema } from "@/validations/auth/loginSchema";
import { requestReactivation } from "@/services/shared/authService";

import FormGroup from "@/components/common/FormGroup";
import Button from "@/components/common/Button";
import { FaUser, FaLock } from "react-icons/fa";
import AuthLayout from "@/layout/AuthLayout";
import { redirectByRole } from "@/utils/roles";

import "react-toastify/dist/ReactToastify.css";
import "@/assets/styles/auth/auth.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      const user = await dispatch(login(data)).unwrap();
      toast.success("Đăng nhập thành công!");
      const redirectPath = redirectByRole(user.role);
      navigate(redirectPath);
    } catch (err) {
      console.log("🚨 Chi tiết lỗi login:", err);
      const code = err?.code;
      const msg = err?.message || "Sai tài khoản hoặc mật khẩu.";

      // 🔒 Nếu tài khoản bị khóa, gợi ý gửi yêu cầu mở khóa
      if (code === "INACTIVE") {
        toast.error(msg);
        const confirmSend = window.confirm(
          "Tài khoản đã bị khóa. Bạn có muốn gửi yêu cầu mở khóa không?"
        );
        if (confirmSend) {
          try {
            await requestReactivation(data.identifier, data.password);
            toast.success("Đã gửi yêu cầu mở khóa. Vui lòng chờ duyệt.");
          } catch (error) {
            console.error("🚀 ~ Yêu cầu mở khóa thất bại:", error);
            toast.error(
              "Yêu cầu mở khóa đã được gửi trước đó. Vui lòng chờ duyệt."
            );
          }
        }
      } else {
        toast.error(msg);
      }

      setError("identifier", { message: msg });
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form">
        <h2 className="auth-form__title">Đăng nhập</h2>

        <form
          className="auth-form__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup
            label="Tài khoản hoặc Email"
            icon={<FaUser />}
            {...register("identifier")}
            error={errors.identifier?.message}
          />
          <FormGroup
            label="Mật khẩu"
            type="password"
            icon={<FaLock />}
            {...register("password")}
            error={errors.password?.message}
          />
          <Button
            className="auth-form__button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <p className="auth-form__message mt-2">
          <span
            className="text-link"
            onClick={() => navigate("/forgot-password")}
          >
            Quên mật khẩu?
          </span>
        </p>

        <p className="auth-form__message">
          Chưa có tài khoản?{" "}
          <span
            className="text-link"
            onClick={() => navigate("/register")}
          >
            Đăng ký ngay
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
