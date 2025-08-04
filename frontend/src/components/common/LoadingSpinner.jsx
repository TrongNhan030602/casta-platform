import React from "react";
import { FaSpinner } from "react-icons/fa";
import classNames from "classnames";
import "@/assets/styles/common/loading-spinner.css";

const LoadingSpinner = ({ className, size = 24, text }) => {
  return (
    <div className={classNames("loading-spinner", className)}>
      <FaSpinner
        size={size}
        className="loading-spinner__icon"
      />
      {text && <span className="loading-spinner__text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
