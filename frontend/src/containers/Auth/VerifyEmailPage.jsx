import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { FaCheckCircle, FaTimesCircle, FaEnvelope } from "react-icons/fa";
import AuthLayout from "@/layout/AuthLayout";
import FormGroup from "@/components/common/FormGroup";
import Button from "@/components/common/Button";
import {
  verifyEmail,
  resendVerificationEmail,
} from "@/services/shared/authService";
import { verifyEmailSchema } from "@/validations/auth/verifyEmailSchema";

import "react-toastify/dist/ReactToastify.css";
import "@/assets/styles/auth/auth.css";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verifyEmailSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    const handleVerify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        console.log(err);

        setStatus("error");
      }
    };

    if (token) handleVerify();
    else setStatus("error");
  }, [token, navigate]);

  const onResend = async ({ email }) => {
    try {
      await resendVerificationEmail(email);
      toast.success("✅ Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư.");
    } catch (err) {
      const msg = err?.response?.data?.message || "Gửi lại email thất bại.";
      toast.error(msg);
      setError("email", { message: msg });
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form">
        {status === "loading" && (
          <p className="auth-form__message">Đang xác thực email...</p>
        )}

        {status === "success" && (
          <>
            <FaCheckCircle className="auth-form__icon success" />
            <h3 className="auth-form__title">Xác thực thành công!</h3>
            <p className="auth-form__message success">
              Bạn sẽ được chuyển đến trang đăng nhập...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <FaTimesCircle className="auth-form__icon error" />
            <h3 className="auth-form__title error">Xác thực thất bại!</h3>
            <p className="auth-form__message error">
              Liên kết không hợp lệ hoặc đã hết hạn.
            </p>

            <form onSubmit={handleSubmit(onResend)}>
              <FormGroup
                label="Email"
                icon={<FaEnvelope />}
                type="email"
                error={errors.email?.message}
                {...register("email")}
              />

              <Button
                type="submit"
                variant="primary"
                full
                radius="rounded"
                className="mt-2"
              >
                Gửi lại xác thực
              </Button>
            </form>

            <p className="auth-form__message mt-3">
              <span
                className="text-link"
                onClick={() => navigate("/login")}
              >
                ← Quay lại đăng nhập
              </span>{" "}
              |{" "}
              <span
                className="text-link"
                onClick={() => navigate("/register")}
              >
                Tạo tài khoản mới
              </span>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
