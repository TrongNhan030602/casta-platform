import React from "react";
import Button from "@/components/common/Button";
import SelectBox from "@/components/common/SelectBox";
import { FiX } from "react-icons/fi";

import "@/assets/styles/layout/admin/violation/filter-bar-violation.css";

const perPageOptions = [5, 10, 15, 25, 50].map((n) => ({
  value: n,
  label: `${n} bản ghi/trang`,
}));

const FilterBarViolation = ({ filters, onChange }) => {
  // Cập nhật filter khi input/select thay đổi
  const handleChange = (name, value) => {
    onChange({ ...filters, [name]: value });
  };

  // Reset filter về mặc định
  const handleResetFilters = () => {
    onChange({
      keyword: "",
      perPage: 15,
    });
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        name="keyword"
        placeholder="Tìm theo tên/email"
        value={filters.keyword || ""}
        onChange={(e) => handleChange("keyword", e.target.value)}
        className="filter-bar__input"
      />

      <SelectBox
        options={perPageOptions}
        value={filters.perPage}
        onChange={(value) => handleChange("perPage", parseInt(value, 10))}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={handleResetFilters}
      >
        <FiX />
        Bỏ lọc
      </Button>
    </div>
  );
};

export default FilterBarViolation;
