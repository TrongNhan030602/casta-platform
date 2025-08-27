// @/components/common/TagSelectBox.jsx
import React from "react";
import Select from "react-select";
import classNames from "classnames";
import "@/assets/styles/common/select-box.css";

const TagSelectBox = ({
  id,
  label,
  options = [],
  value = [],
  onChange,
  error,
  required = false,
  placeholder = "-- Chọn tags --",
  className,
  ...props
}) => {
  // Chọn value dạng object { value, label }
  const handleChange = (selected) => {
    onChange(selected || []); // luôn trả về mảng object
  };

  return (
    <div className={classNames("c-select", className)}>
      {label && (
        <label
          className="c-select__label"
          htmlFor={id}
        >
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      <Select
        inputId={id}
        isMulti
        options={options}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        classNamePrefix="react-select"
        className={classNames({ "has-error": !!error })}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menu: (base) => ({ ...base, minWidth: "200px" }),
        }}
        {...props}
      />

      {error && <p className="c-select__error">{error}</p>}
    </div>
  );
};

export default TagSelectBox;
