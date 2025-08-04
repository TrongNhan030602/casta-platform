import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Form } from "react-bootstrap";

const CancelContractModal = ({ open, onClose, onSubmit, contract }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Hủy yêu cầu hợp đồng"
    >
      <p>
        Bạn có chắc chắn muốn hủy yêu cầu hợp đồng{" "}
        <strong>{contract?.code}</strong>?
      </p>
      <Form.Group className="mb-3">
        <Form.Label>Lý do hủy</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Nhập lý do hủy..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Form.Group>
      <div className="d-flex justify-content-end gap-2">
        <Button
          variant="outline"
          onClick={handleClose}
        >
          Đóng
        </Button>
        <Button
          variant="danger"
          onClick={handleSubmit}
        >
          Xác nhận hủy
        </Button>
      </div>
    </Modal>
  );
};

export default CancelContractModal;
