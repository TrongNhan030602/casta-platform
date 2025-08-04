import React from "react";
import Button from "@/components/common/Button";
import SelectBox from "@/components/common/SelectBox";
import { FiX } from "react-icons/fi";
import "@/assets/styles/common/filter-bar.css";

const CommonFilterBar = ({ filters, fields, onChange, showPerPage = true }) => {
  const handleChange = (name, value) => {
    onChange({ ...filters, [name]: value });
  };

  const handleResetFilters = () => {
    const reset = Object.fromEntries(
      Object.keys(filters).map((key) => [key, ""])
    );
    onChange({ ...reset, perPage: 10 });
  };

  const perPageOptions = [5, 10, 15, 25, 50].map((n) => ({
    value: n,
    label: `${n} bản ghi/trang`,
  }));

  return (
    <div className="filter-bar">
      {fields.map((field) => {
        const commonProps = {
          name: field.name,
          value: filters[field.name] || "",
          onChange: (e) => handleChange(field.name, e.target.value),
          placeholder: field.placeholder || "",
          className: "filter-bar__input",
          id: field.name,
        };

        const renderInput = () => {
          if (field.type === "text") {
            return (
              <input
                type="text"
                {...commonProps}
              />
            );
          }

          if (field.type === "date") {
            return (
              <input
                type="date"
                {...commonProps}
              />
            );
          }

          if (field.type === "select") {
            return (
              <SelectBox
                options={field.options}
                value={
                  filters[field.name] ||
                  (Array.isArray(field.options) && field.options.length > 0
                    ? field.options[0].value
                    : "")
                }
                onChange={(value) => handleChange(field.name, value)}
                placeholder={field.placeholder}
              />
            );
          }

          return null;
        };

        // Nếu có label thì bọc thêm để hiển thị
        return field.label ? (
          <div
            key={field.name}
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: "160px",
            }}
          >
            <label
              htmlFor={field.name}
              style={{
                fontSize: "13px",
                fontWeight: 500,
                marginBottom: "4px",
                color: "#333",
              }}
            >
              {field.label}
            </label>
            {renderInput()}
          </div>
        ) : (
          <React.Fragment key={field.name}>{renderInput()}</React.Fragment>
        );
      })}

      {showPerPage && (
        <SelectBox
          options={perPageOptions}
          value={
            perPageOptions.find((opt) => opt.value === filters.perPage)
              ?.value || 10
          }
          onChange={(value) => {
            const parsed = parseInt(value);
            handleChange("perPage", isNaN(parsed) ? 10 : parsed);
          }}
          placeholder="Số bản ghi"
        />
      )}

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

export default CommonFilterBar;
