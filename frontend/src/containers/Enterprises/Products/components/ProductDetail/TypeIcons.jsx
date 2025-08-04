import React from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaSyncAlt,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

export const typeIcons = {
  import: <FaArrowDown className="text-success" />,
  sale: <FaArrowUp className="text-danger" />,
  return_import: <FaSyncAlt className="text-primary" />,
  return_sale: <FaSyncAlt className="text-primary" />,
  adjust_increase: <FaPlus className="text-info" />,
  adjust_decrease: <FaMinus className="text-warning" />,
};
