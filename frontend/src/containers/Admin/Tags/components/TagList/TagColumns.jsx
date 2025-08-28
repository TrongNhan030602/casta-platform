import React from "react";
import { FaHashtag } from "react-icons/fa";
import Button from "@/components/common/Button";

const TAG_STATUSES = {
  active: { label: "Đang hoạt động", color: "success" },
  deleted: { label: "Đã xóa", color: "danger" },
};

const TagColumns = (navigate, handleActionClick) => [
  {
    label: "ID",
    key: "id",
    render: (row) => (
      <button
        onClick={() => navigate(`/admin/tags/${row.id}/edit`)}
        className="link-button"
        title={`#${row.id}`}
      >
        <FaHashtag /> {row.id}
      </button>
    ),
  },
  {
    label: "Tên tag",
    key: "name",
    render: (row) => <span className="link">{row.name}</span>,
  },
  {
    label: "Slug",
    key: "slug",
    render: (row) => <span>{row.slug}</span>,
  },
  {
    label: "Trạng thái",
    render: (row) => {
      const status = row.deleted_at
        ? TAG_STATUSES.deleted
        : TAG_STATUSES.active;
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
              onClick={() => navigate(`/admin/tags/${row.id}/edit`)}
            >
              Sửa
            </Button>
            <Button
              size="sm"
              variant="danger-outline"
              onClick={() => handleActionClick(row, "delete")}
            >
              Xóa
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

export default TagColumns;
