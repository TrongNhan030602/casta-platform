import React from "react";
import classNames from "classnames";
import "@/assets/styles/common/switch-toggle.css";

const SwitchToggle = ({ label, className, checked, onChange, id }) => {
  return (
    <label className={classNames("c-switch", className)}>
      <input
        type="checkbox"
        checked={checked}
        id={id}
        onChange={onChange}
      />
      <span className="c-switch__slider" />
      {label && <span className="c-switch__label">{label}</span>}
    </label>
  );
};

export default SwitchToggle;
