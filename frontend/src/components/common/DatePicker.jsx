import React from "react";
import classNames from "classnames";
import "@/assets/styles/common/date-picker.css";

const DatePicker = ({ label, error, className, ...props }) => {
  return (
    <div className={classNames("c-date-picker", className)}>
      {label && <label className="c-date-picker__label">{label}</label>}
      <input
        type="date"
        className={classNames("c-date-picker__input", {
          invalid: !!error,
        })}
        {...props}
      />
      {error && <p className="c-date-picker__error">{error}</p>}
    </div>
  );
};

export default DatePicker;
