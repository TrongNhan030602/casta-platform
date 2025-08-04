import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import classNames from "classnames";

const RatingStars = ({ value = 0, max = 5, onChange, readOnly = false }) => {
  const [hovered, setHovered] = useState(null);

  const handleClick = (index) => {
    if (!readOnly) {
      onChange?.(index);
    }
  };

  const handleMouseEnter = (index) => {
    if (!readOnly) {
      setHovered(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHovered(null);
    }
  };

  return (
    <div className="d-flex gap-1">
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        const isFilled = hovered ? index <= hovered : index <= value;

        return (
          <FaStar
            key={index}
            size={22}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className={classNames(
              isFilled ? "text-warning" : "text-secondary",
              { pointer: !readOnly }
            )}
            title={`${index} sao`}
            style={{
              transition: "transform 0.2s",
              cursor: readOnly ? "default" : "pointer",
            }}
            onMouseOver={(e) => {
              if (!readOnly) e.currentTarget.style.transform = "scale(1.2)";
            }}
            onMouseOut={(e) => {
              if (!readOnly) e.currentTarget.style.transform = "scale(1)";
            }}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
