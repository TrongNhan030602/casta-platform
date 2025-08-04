import LoginPage from "@/containers/Auth/LoginPage";
import RegisterPage from "@/containers/Auth/RegisterPage";
import ForgotPasswordPage from "@/containers/Auth/ForgotPasswordPage";
import ResetPasswordPage from "@/containers/Auth/ResetPasswordPage";
import VerifyEmailPage from "@/containers/Auth/VerifyEmailPage";
import WelcomePage from "@/containers/Auth/WelcomePage";
import UnauthorizedPage from "@/containers/Common/UnauthorizedPage";

import PublicRoute from "@/components/routes/PublicRoute";

export const authRoutes = [
  {
    path: "/",
    element: (
      <PublicRoute>
        <WelcomePage />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ResetPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: "/verify-email",
    element: (
      <PublicRoute>
        <VerifyEmailPage />
      </PublicRoute>
    ),
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />, // ❌ Không cần bọc PublicRoute
  },
];
