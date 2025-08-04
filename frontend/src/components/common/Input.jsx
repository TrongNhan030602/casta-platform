import React from "react";
import "@/assets/styles/common/input.css";

const Input = ({
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled,
  ...props
}) => {
  return (
    <div
      className={`form-input ${error ? "form-input--error" : ""} ${
        disabled ? "form-input--disabled" : ""
      }`}
    >
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
        className="form-input__input"
        disabled={disabled}
      />
      {error && <span className="form-input__error-message">{error}</span>}
    </div>
  );
};

export default Input;
