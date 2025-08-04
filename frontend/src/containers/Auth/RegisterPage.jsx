import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import FormGroup from "@/components/common/FormGroup";
import Button from "@/components/common/Button";
import AuthLayout from "@/layout/AuthLayout";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import {
  registerCustomer,
  registerEnterprise,
} from "@/services/shared/authService";

import { registerSchema } from "@/validations/auth/registerSchema";

import "react-toastify/dist/ReactToastify.css";
import "@/assets/styles/auth/auth.css";

const RegisterPage = () => {
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      if (role === "customer") {
        await registerCustomer(data);
      } else {
        await registerEnterprise(data);
      }

      toast.success(
        "🎉 Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt."
      );
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.message || "Đăng ký thất bại.";
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form">
        <h2 className="auth-form__title">Đăng ký tài khoản</h2>

        <div className="auth-form__role-switch">
          <Button
            type="button"
            variant={role === "customer" ? "primary" : "outline"}
            className="me-2"
            onClick={() => setRole("customer")}
          >
            Khách hàng
          </Button>
          <Button
            type="button"
            variant={role === "enterprise" ? "primary" : "outline"}
            onClick={() => setRole("enterprise")}
          >
            Doanh nghiệp
          </Button>
        </div>

        <form
          className="auth-form__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup
            label="Tên đăng nhập"
            icon={<FaUser />}
            {...register("name")}
            error={errors.name?.message}
          />
          <FormGroup
            label="Email"
            icon={<FaEnvelope />}
            {...register("email")}
            error={errors.email?.message}
          />
          <FormGroup
            label="Mật khẩu"
            type="password"
            icon={<FaLock />}
            {...register("password")}
            error={errors.password?.message}
          />
          <FormGroup
            label="Nhập lại mật khẩu"
            type="password"
            icon={<FaLock />}
            {...register("password_confirmation")}
            error={errors.password_confirmation?.message}
          />
          <Button
            className="auth-form__button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </form>

        <p className="auth-form__message">
          Đã có tài khoản?{" "}
          <span
            className="text-link"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
