import { FaHashtag } from "react-icons/fa";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import { formatDateTime } from "@/utils/formatDateTime";
import { EXHIBITION_PRODUCT_STATUSES } from "@/constants/exhibitionProductStatus";

/**
 * @param {Function} setSelectedProduct - callback chọn sản phẩm
 * @param {Function} openRejectModal - callback mở modal từ chối
 * @param {Function} openDeleteModal - callback mở modal xoá
 * @param {Function} openApproveModal - callback mở modal duyệt
 */
export const getColumns = (
  setSelectedProduct,
  openRejectModal,
  openDeleteModal,
  openApproveModal
) => [
  {
    label: "ID",
    key: "id",
    sortable: true,
    render: (row) => (
      <span className="text-muted">
        <FaHashtag /> {row.id}
      </span>
    ),
  },
  {
    label: "Tên sản phẩm",
    render: (row) => row.product?.name || "(Không rõ)",
  },
  {
    label: "Doanh nghiệp",
    render: (row) => row.rental_contract?.enterprise?.company_name || "--",
  },
  {
    label: "Hợp đồng",
    render: (row) => row.rental_contract?.code || "--",
  },
  {
    label: "Không gian",
    render: (row) => row.exhibition_space?.name || "--",
  },

  {
    label: "Panorama",
    render: (row) => row.position_metadata?.panoramaId || "--",
  },
  {
    label: "Thời gian gắn",
    key: "created_at",
    sortable: true,
    render: (row) => formatDateTime(row.created_at),
  },
  {
    label: "Trạng thái",
    render: (row) => {
      const status = row.status ?? "pending";
      const meta = EXHIBITION_PRODUCT_STATUSES[status];

      if (!meta) {
        return (
          <Badge
            label={status}
            color="secondary"
          />
        );
      }

      const { label, color, icon: Icon } = meta;

      return (
        <Badge color={color}>
          <span className="d-flex align-items-center gap-1">
            <Icon size={14} /> {label}
          </span>
        </Badge>
      );
    },
  },
  {
    label: "Hành động",
    render: (row) => {
      const status = row.status;
      const canApprove = status === "pending"; // CHỈ cho duyệt khi pending
      const canReject = status === "pending";
      const canDelete = status === "pending" || status === "rejected";

      const handleSelect = (action) => {
        setSelectedProduct(row);
        action();
      };

      const actionButtons = [];

      if (canApprove) {
        actionButtons.push(
          <Button
            key="approve"
            size="sm"
            variant="primary"
            onClick={() => handleSelect(openApproveModal)}
          >
            Duyệt
          </Button>
        );
      }

      if (canReject) {
        actionButtons.push(
          <Button
            key="reject"
            size="sm"
            variant="secondary"
            onClick={() => handleSelect(openRejectModal)}
          >
            Từ chối
          </Button>
        );
      }

      if (canDelete) {
        actionButtons.push(
          <Button
            key="delete"
            size="sm"
            variant="danger-outline"
            onClick={() => handleSelect(openDeleteModal)}
          >
            Xoá
          </Button>
        );
      }

      return actionButtons.length > 0 ? (
        <div className="d-flex gap-2 flex-wrap">{actionButtons}</div>
      ) : (
        <span className="text-muted">_</span>
      );
    },
  },
];
