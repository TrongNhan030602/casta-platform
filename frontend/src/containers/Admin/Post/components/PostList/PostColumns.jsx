import React from "react";
import { FaHashtag } from "react-icons/fa";
import Button from "@/components/common/Button";

// Mapping status post
const POST_STATUSES = {
  draft: { label: "Nháp", color: "secondary" },
  published: { label: "Đã xuất bản", color: "success" },
  scheduled: { label: "Hẹn giờ", color: "info" },
  archived: { label: "Lưu trữ", color: "warning" },
};

const POST_TYPES = {
  news: { label: "Tin tức", color: "primary" },
  event: { label: "Sự kiện", color: "info" },
};

const PostColumns = (navigate, handleActionClick) => [
  {
    label: "ID",
    key: "id",
    render: (row) => (
      <button
        onClick={() => navigate(`/admin/posts/${row.id}`)}
        className="link-button"
        title={`#${row.id}`}
      >
        <FaHashtag /> {row.id}
      </button>
    ),
  },
  {
    label: "Tiêu đề",
    key: "title",
    render: (row) => <span className="link">{row.title}</span>,
  },
  {
    label: "Loại",
    render: (row) => {
      const type = POST_TYPES[row.type] || { label: row.type, color: "dark" };
      return <span className={`badge badge--${type.color}`}>{type.label}</span>;
    },
  },
  {
    label: "Trạng thái",
    render: (row) => {
      const status = POST_STATUSES[row.status] || {
        label: row.status,
        color: "secondary",
      };
      return (
        <span className={`badge badge--${status.color}`}>{status.label}</span>
      );
    },
  },
  {
    label: "Tác giả",
    render: (row) => <span>{row.author?.name || "—"}</span>,
  },
  {
    label: "Ngày xuất bản",
    render: (row) => <span>{row.published_at ? row.published_at : "—"}</span>,
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
              onClick={() => navigate(`/admin/posts/${row.id}/edit`)}
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

export default PostColumns;
