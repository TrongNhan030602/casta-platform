import React from "react";
import { FaHashtag } from "react-icons/fa";
import Button from "@/components/common/Button";
import { SERVICE_CATEGORY_STATUSES } from "@/constants/serviceCategoryStatus";

const ServiceCategoryColumns = (navigate, handleActionClick) => [
  {
    label: "ID",
    key: "id",
    render: (row) => (
      <button
        onClick={() => navigate(`/admin/services-categories/${row.id}/edit`)}
        className="link-button"
        title={`#${row.id}`}
      >
        <FaHashtag />
        {row.id}
      </button>
    ),
  },
  { label: "Tên danh mục", key: "name" },
  {
    label: "Mô tả",
    render: (row) => <span>{row.description || "—"}</span>,
  },
  {
    label: "Trạng thái",
    render: (row) => {
      const status = SERVICE_CATEGORY_STATUSES[row.status] || {
        label: row.status,
        color: "secondary",
      };
      return (
        <span className={`badge badge--${status.color}`}>{status.label}</span>
      );
    },
  },
  {
    label: "Danh mục cha",
    render: (row) =>
      row.parent_category ? (
        <span>{row.parent_category.name}</span>
      ) : (
        <span>—</span>
      ),
  },
  {
    label: "Hành động",
    render: (row) => (
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {/* Nếu chưa xóa mềm */}
        {!row.deleted_at && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                navigate(`/admin/services-categories/${row.id}/edit`)
              }
            >
              Sửa
            </Button>
            <Button
              size="sm"
              variant="danger-outline"
              onClick={() => handleActionClick(row, "delete")}
            >
              Xoá
            </Button>
          </>
        )}

        {/* Nếu đã xóa mềm */}
        {row.deleted_at && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleActionClick(row, "restore")}
            >
              Khôi phục
            </Button>
            <Button
              size="sm"
              variant="danger-outline"
              onClick={() => handleActionClick(row, "force")}
            >
              Xóa vĩnh viễn
            </Button>
          </>
        )}
      </div>
    ),
  },
];

export default ServiceCategoryColumns;
