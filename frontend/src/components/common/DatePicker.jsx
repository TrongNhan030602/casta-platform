import React from "react";
import classNames from "classnames";
import "@/assets/styles/common/date-picker.css";

const DatePicker = ({
  label,
  error,
  className,
  value,
  onChange,
  mode = "date", // date | datetime
  ...props
}) => {
  // format về chuẩn HTML input
  const formatValue = (val) => {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d.getTime())) return "";

    const pad = (n) => String(n).padStart(2, "0");
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());

    if (mode === "date") {
      return `${d.getFullYear()}-${month}-${day}`;
    } else if (mode === "datetime") {
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${d.getFullYear()}-${month}-${day}T${hours}:${minutes}`;
    }
    return "";
  };

  // callback onChange chuẩn hóa value về ISO string
  const handleChange = (e) => {
    if (!e || !e.target) return onChange("");
    const val = e.target.value;
    if (!val) return onChange("");

    if (mode === "date") {
      onChange(val); // YYYY-MM-DD
    } else if (mode === "datetime") {
      onChange(val.replace("T", " ")); // YYYY-MM-DD HH:mm
    }
  };

  return (
    <div className={classNames("c-date-picker", className)}>
      {label && <label className="c-date-picker__label">{label}</label>}
      <input
        type={mode === "datetime" ? "datetime-local" : "date"}
        className={classNames("c-date-picker__input", { invalid: !!error })}
        value={formatValue(value)}
        onChange={handleChange}
        {...props}
      />
      {error && <p className="c-date-picker__error">{error}</p>}
    </div>
  );
};

export default DatePicker;
