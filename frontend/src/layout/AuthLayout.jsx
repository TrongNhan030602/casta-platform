import React from "react";
import "@/assets/styles/auth/layout.css";

const AuthLayout = ({ children, logo = "/logo-casta.webp" }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__box">
        <img
          src={logo}
          alt="Logo"
          className="auth-layout__logo"
        />
        {children}
        <p className="auth-layout__footer">
          © {new Date().getFullYear()} Sàn giao dịch công nghệ CASTA
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
