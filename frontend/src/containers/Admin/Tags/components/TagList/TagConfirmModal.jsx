import React from "react";
import ConfirmModal from "@/components/common/ConfirmModal";

const TagConfirmModal = ({ open, onCancel, onConfirm, actionType }) => {
  const title =
    actionType === "restore"
      ? "Xác nhận khôi phục tag"
      : actionType === "force"
      ? "Xác nhận xóa vĩnh viễn tag"
      : "Xác nhận xóa tag";

  const message =
    actionType === "restore"
      ? "Bạn có chắc chắn muốn khôi phục tag này không?"
      : actionType === "force"
      ? "Bạn có chắc chắn muốn xóa vĩnh viễn tag này không? Hành động này không thể hoàn tác."
      : "Bạn có chắc chắn muốn xóa tag này không?";

  return (
    <ConfirmModal
      open={open}
      title={title}
      message={<p>{message}</p>}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
};

export default TagConfirmModal;
