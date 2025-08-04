import { formatDateTime } from "@/utils/formatDateTime";

const ViolationList = ({ violations }) => (
  <div>
    {violations.length > 0 ? (
      <ul className="violation-list">
        {violations.map((v, idx) => (
          <li key={idx}>
            <strong>Lý do:</strong> {v.reason}
            <br />
            <strong>Chi tiết:</strong> {v.details}
            <br />
            <small>{formatDateTime(v.created_at)}</small>
          </li>
        ))}
      </ul>
    ) : (
      <p className="no-data">Không có cảnh báo vi phạm</p>
    )}
  </div>
);

export default ViolationList;
