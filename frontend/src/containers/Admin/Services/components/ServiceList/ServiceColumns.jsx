import React from "react";
import { FaHashtag } from "react-icons/fa";
import Button from "@/components/common/Button";

// Mapping trạng thái dịch vụ
const SERVICE_STATUSES = {
  draft: { label: "Nháp", color: "secondary" },
  published: { label: "Đã xuất bản", color: "success" },
  archived: { label: "Lưu trữ", color: "warning" },
};

const ServiceColumns = (navigate, handleActionClick) => [
  {
    label: "ID",
    key: "id",
    render: (row) => (
      <button
        onClick={() => navigate(`/admin/services/${row.id}`)}
        className="link-button"
        title={`#${row.id}`}
      >
        <FaHashtag /> {row.id}
      </button>
    ),
  },
  {
    label: "Tên dịch vụ",
    key: "name",
    render: (row) => <span className="link">{row.name}</span>,
  },
  {
    label: "Danh mục",
    render: (row) => <span>{row.category?.name || "—"}</span>,
  },
  {
    label: "Giá",
    render: (row) =>
      row.price
        ? `${Number(row.price).toLocaleString()} ${row.currency || "VND"}`
        : "—",
  },
  {
    label: "Thời gian (phút)",
    render: (row) => row.duration_minutes || "—",
  },
  {
    label: "Trạng thái",
    render: (row) => {
      const status = SERVICE_STATUSES[row.status] || {
        label: row.status,
        color: "secondary",
      };
      return (
        <span className={`badge badge--${status.color}`}>{status.label}</span>
      );
    },
  },
  {
    label: "Hành động",
    render: (row) => (
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {!row.deleted_at && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/services/${row.id}/edit`)}
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

export default ServiceColumns;
