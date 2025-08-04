import React from "react";
import { FaHashtag } from "react-icons/fa";
import Button from "@/components/common/Button";
import { getStorageUrl } from "@/utils/getStorageUrl";
import { formatCurrency } from "@/utils/formatCurrency";
import { PRODUCT_STATUSES } from "@/constants/productStatus";

export const getColumns = (
  navigate,
  handleApprove,
  handleDelete,
  handleRestore,
  isDeletedTab = false,
  handleForceDelete // ✅ thêm tham số mới để xử lý xóa vĩnh viễn
) => [
  {
    label: "ID",
    key: "id",
    render: (row) => (
      <button
        className="link-button"
        onClick={() => navigate(`/admin/products/${row.id}`)}
      >
        <FaHashtag /> {row.id}
      </button>
    ),
  },
  {
    label: "Ảnh",
    render: (row) => (
      <img
        src={getStorageUrl(row.main_image)}
        alt={row.name}
        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
      />
    ),
  },
  {
    label: "Tên sản phẩm",
    render: (row) => row.name,
  },
  {
    label: "Doanh nghiệp",
    render: (row) => row.enterprise?.name || "-",
  },
  {
    label: "Danh mục",
    render: (row) => row.category?.name || "-",
  },
  {
    label: "Giá",
    key: "price",
    render: (row) => formatCurrency(row.price),
  },
  {
    label: "Trạng thái",
    render: (row) => {
      const status = PRODUCT_STATUSES[row.status];
      return (
        <span className={`badge badge--${status?.color || "secondary"}`}>
          {status?.label || row.status}
        </span>
      );
    },
  },
  {
    label: "Hành động",
    render: (row) => (
      <div className="d-flex gap-2 flex-wrap">
        {!isDeletedTab && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/products/${row.id}/edit`)}
            >
              Sửa
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleApprove(row)}
            >
              Trạng thái
            </Button>
            <Button
              size="sm"
              variant="danger-outline"
              onClick={() => handleDelete(row)} // ✅ xoá mềm
            >
              Xóa
            </Button>
          </>
        )}

        {isDeletedTab && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRestore(row)}
            >
              Khôi phục
            </Button>
            <Button
              size="sm"
              variant="danger-outline"
              onClick={() => handleForceDelete(row)} // ✅ xoá vĩnh viễn
            >
              Xóa vĩnh viễn
            </Button>
          </>
        )}
      </div>
    ),
  },
];
