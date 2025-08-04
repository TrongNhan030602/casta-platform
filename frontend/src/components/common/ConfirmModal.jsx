import React from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import "@/assets/styles/common/confirm-modal.css";

const ConfirmModal = ({
  open,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện thao tác này?",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
    >
      <div className="confirm-modal">
        <div className="confirm-modal__message">
          {typeof message === "string" ? (
            <p className="confirm-modal__message">{message}</p>
          ) : (
            message
          )}
        </div>

        <div className="confirm-modal__actions">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
