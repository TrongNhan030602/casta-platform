import React from "react";
import classNames from "classnames";
import "@/assets/styles/common/badge.css"; // 👇 tạo file này bên dưới

const Badge = ({ label, color = "gray", className = "", children }) => {
  return (
    <span className={classNames("badge", `badge--${color}`, className)}>
      {children || label}
    </span>
  );
};

export default Badge;
