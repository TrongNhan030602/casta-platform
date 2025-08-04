// \src\containers\Admin\Users\components\FilterBar.jsx

import React from "react";
import Button from "@/components/common/Button";
import SelectBox from "@/components/common/SelectBox";
import { FiX } from "react-icons/fi";
import { roleLabelMap, statusMap } from "@/utils/roles";

import "@/assets/styles/layout/admin/users/filter-bar.css";

const FilterBar = ({ filters, onChange }) => {
  const handleChange = (name, value) => {
    onChange({ ...filters, [name]: value });
  };

  const handleResetFilters = () => {
    onChange({
      role: "",
      status: "",
      keyword: "",
      perPage: 10,
    });
  };

  // Convert object to array for select
  const roleOptions = Object.entries(roleLabelMap).map(([value, label]) => ({
    value,
    label,
  }));

  const statusOptions = Object.entries(statusMap).map(([value, obj]) => ({
    value,
    label: obj.label,
  }));

  const perPageOptions = [5, 10, 15, 25, 50].map((n) => ({
    value: n,
    label: `${n} bản ghi/trang`,
  }));

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
        options={roleOptions}
        value={filters.role}
        onChange={(value) => handleChange("role", value)}
        placeholder="Tất cả vai trò"
      />

      <SelectBox
        options={statusOptions}
        value={filters.status}
        onChange={(value) => handleChange("status", value)}
        placeholder="Tất cả trạng thái"
      />

      <SelectBox
        options={perPageOptions}
        value={
          perPageOptions.find((opt) => opt.value === filters.perPage)?.value ||
          10
        }
        onChange={(value) => {
          const parsed = parseInt(value);
          if (!isNaN(parsed)) {
            handleChange("perPage", parsed);
          } else {
            handleChange("perPage", 10); // fallback
          }
        }}
        placeholder="Số bản ghi"
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

export default FilterBar;
