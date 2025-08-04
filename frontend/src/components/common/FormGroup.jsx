import React, { useState } from "react";
import classNames from "classnames";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "@/assets/styles/common/form-group.css";

const FormGroup = ({
  id,
  label,
  icon,
  error,
  required = false, // ✅ Thêm prop này
  showToggle = false,
  type = "text",
  className = "",
  children,
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const renderInput = () => (
    <input
      {...inputProps}
      id={id}
      type={showPassword && isPassword ? "text" : type}
      className={classNames("c-form-group__input", {
        invalid: !!error,
      })}
    />
  );

  return (
    <div className={classNames("c-form-group", className)}>
      {label && (
        <label
          className="c-form-group__label"
          htmlFor={id}
        >
          {icon && <span className="c-form-group__icon">{icon}</span>}
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      <div className="c-form-group__input-wrapper">
        {children ? children : renderInput()}
        {showToggle && isPassword && (
          <span
            className="c-form-group__toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>

      {error && <p className="c-form-group__error">{error}</p>}
    </div>
  );
};

export default FormGroup;
