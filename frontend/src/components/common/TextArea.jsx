import React from "react";
import classNames from "classnames";
import "@/assets/styles/common/textarea.css";

const TextArea = ({ label, error, className, rows = 4, ...props }) => {
  return (
    <div className={classNames("c-textarea", className)}>
      {label && <label className="c-textarea__label">{label}</label>}

      <textarea
        rows={rows}
        className={classNames("c-textarea__input", {
          invalid: !!error,
        })}
        {...props}
      />

      {error && <p className="c-textarea__error">{error}</p>}
    </div>
  );
};

export default TextArea;
