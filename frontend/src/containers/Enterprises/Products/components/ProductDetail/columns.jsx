import Tooltip from "./Tooltip"; // đường dẫn đúng
import { typeIcons } from "./TypeIcons";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDateTime } from "@/utils/formatDateTime";

export const columns = [
  {
    label: "Thời gian",
    key: "created_at",
    render: (log) => formatDateTime(log.created_at),
  },
  {
    label: "Loại",
    render: (log) => (
      <>
        {typeIcons[log.type] && (
          <span className="me-2 align-middle">{typeIcons[log.type]}</span>
        )}
        {log.type_label}
      </>
    ),
  },
  {
    label: "Số lượng",
    key: "quantity",
    render: (log) => <div className="text-end">{log.quantity}</div>,
  },
  {
    label: "Đơn giá",
    key: "unit_price",
    render: (log) => (
      <div className="text-end">
        {log.unit_price ? formatCurrency(log.unit_price) : "—"}
      </div>
    ),
  },
  {
    label: (
      <span className="d-inline-flex align-items-center">
        Tồn kho sau{" "}
        <Tooltip text="Tồn kho tính sau khi thao tác này được thực hiện" />
      </span>
    ),
    key: "stock_after",
    render: (log) => (
      <div className="text-end">
        {log.stock_after !== null ? log.stock_after : "—"}
      </div>
    ),
  },
  {
    label: (
      <span className="d-inline-flex align-items-center">
        Giá vốn sau <Tooltip text="Giá vốn trung bình tính đến thời điểm này" />
      </span>
    ),
    key: "avg_cost_after",
    render: (log) => (
      <div className="text-end">
        {log.avg_cost_after !== null ? formatCurrency(log.avg_cost_after) : "—"}
      </div>
    ),
  },
  {
    label: "Ghi chú",
    render: (log) => (
      <Tooltip text={log.note}>
        <div
          className="text-truncate"
          style={{ maxWidth: 200 }}
        >
          {log.note || "—"}
        </div>
      </Tooltip>
    ),
  },
];
