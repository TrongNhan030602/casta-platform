import React from "react";
import SelectBox from "@/components/common/SelectBox";
import Button from "@/components/common/Button";
import { FiX } from "react-icons/fi";

const EnterpriseFilterBar = ({ filters, onFilterChange, onReset }) => {
  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ duyệt" },
    { value: "approved", label: "Đã duyệt" },
    { value: "rejected", label: "Từ chối" },
    { value: "suspended", label: "Tạm ngưng" },
  ];

  const perPageOptions = [10, 15, 25, 50].map((n) => ({
    value: n,
    label: `${n} bản ghi/trang`,
  }));

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Tìm tên/MST/đại diện"
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
        className="filter-bar__input"
      />

      <SelectBox
        options={statusOptions}
        value={filters.status}
        onChange={(value) => onFilterChange("status", value)}
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
            onFilterChange("perPage", parsed);
          } else {
            onFilterChange("perPage", 10);
          }
        }}
        placeholder="Số bản ghi"
      />

      <Button
        size="sm"
        variant="outline"
        onClick={onReset}
      >
        <FiX />
        Bỏ lọc
      </Button>
    </div>
  );
};

export default EnterpriseFilterBar;
