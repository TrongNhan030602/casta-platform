// Tooltip.jsx
import React, { useEffect, useRef } from "react";
import { Tooltip as BootstrapTooltip } from "bootstrap";

const Tooltip = ({ text, children }) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      const tooltip = new BootstrapTooltip(ref.current, {
        title: text,
        placement: "top",
        trigger: "hover",
      });
      return () => tooltip.dispose();
    }
  }, [text]);

  if (!children) {
    // Trường hợp mặc định: chỉ hiển thị icon
    return (
      <span
        ref={ref}
        className="ms-1 text-muted"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title={text}
        style={{ cursor: "help" }}
      >
        <i className="bi bi-info-circle"></i>
      </span>
    );
  }

  // Trường hợp wrap phần tử tùy ý (text, div, v.v)
  return React.cloneElement(children, {
    ref,
    "data-bs-toggle": "tooltip",
    "data-bs-placement": "top",
    title: text,
    style: {
      cursor: "help",
      ...(children.props.style || {}),
    },
  });
};

export default Tooltip;
