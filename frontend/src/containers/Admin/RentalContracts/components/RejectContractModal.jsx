import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import TextArea from "@/components/common/TextArea";
import "@/assets/styles/layout/admin/rental-contract/reject-contract-modal.css";

const RejectContractModal = ({ open, onClose, onReject, loading }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  // Reset khi mở modal
  useEffect(() => {
    if (open) {
      setReason("");
      setError("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do từ chối.");
      return;
    }
    onReject(reason);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Từ chối hợp đồng"
    >
      <div className="reject-contract-modal">
        <TextArea
          label="Lý do từ chối *"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError("");
          }}
          error={error}
          placeholder="Nhập lý do từ chối..."
          rows={4}
        />
        <div className="reject-contract-modal__actions">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="reject-contract-modal__btn"
          >
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            disabled={loading}
            className="reject-contract-modal__btn"
          >
            {loading ? "Đang gửi..." : "Xác nhận từ chối"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectContractModal;
