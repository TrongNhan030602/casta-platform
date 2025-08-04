import React, { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { getViolationsByUser } from "@/services/admin/violationService";
import { formatDateTime } from "@/utils/formatDateTime";

const UserViolationsModal = ({ open, onClose, user }) => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      setLoading(true);
      getViolationsByUser(user.id)
        .then((res) => setViolations(res.data || []))
        .catch(() => setViolations([]))
        .finally(() => setLoading(false));
    }
  }, [open, user]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Cảnh báo vi phạm của #${user?.id}`}
    >
      <div className="container mt-2">
        {loading ? (
          <div className="alert alert-info">Đang tải...</div>
        ) : violations.length === 0 ? (
          <div className="alert alert-secondary">Không có cảnh báo nào</div>
        ) : (
          <div className="list-group">
            {violations.map((v) => (
              <div
                key={v.id}
                className="list-group-item list-group-item-warning"
              >
                <h6 className="mb-1">
                  <strong>Lý do:</strong> {v.reason}
                </h6>
                {v.details && (
                  <p className="mb-1">
                    <em>Chi tiết:</em> {v.details}
                  </p>
                )}
                <small className="text-muted">
                  <small className="text-muted">
                    {formatDateTime(v.created_at)}
                  </small>
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserViolationsModal;
