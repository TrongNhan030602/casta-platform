import React from "react";
import Select from "react-select";
import classNames from "classnames";
import "@/assets/styles/common/select-box.css";

const SelectBox = ({
  id,
  label,
  options = [],
  value,
  onChange,
  onEnter,
  error,
  required = false,
  placeholder = "-- Chọn --",
  isClearable = true,
  className,
  multiple = false,
  ...props
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value) {
      e.preventDefault();
      onEnter?.();
    }
  };

  // ✅ Xử lý value cho chế độ single vs multiple
  const selectedOption = multiple
    ? options.filter((opt) => (value || []).includes(opt.value))
    : options.find((opt) => opt.value === value) || null;

  const handleChange = (selected) => {
    if (multiple) {
      const values = selected?.map((item) => item.value) || [];
      onChange(values);
    } else {
      onChange(selected?.value || "");
    }
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
        isMulti={multiple} // ✅ quan trọng
        options={options}
        value={selectedOption}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        classNamePrefix="react-select"
        className={classNames({ "has-error": !!error })}
        isClearable={isClearable}
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

export default SelectBox;
