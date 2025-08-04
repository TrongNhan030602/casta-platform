import React from "react";
import classNames from "classnames";
import "@/assets/styles/common/button.css";
import LoadingSpinner from "@/components/common/LoadingSpinner"; // 👈 Thêm vào

const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  full = false,
  radius = "rounded",
  disabled = false,
  loading = false,
  ...props
}) => {
  return (
    <button
      className={classNames(
        "c-button",
        `c-button--${variant}`,
        `c-button--size-${size}`,
        `c-button--radius-${radius}`,
        {
          "c-button--full": full,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="d-flex align-items-center gap-2">
          <LoadingSpinner size={16} />
          <span>Đang xử lý...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
