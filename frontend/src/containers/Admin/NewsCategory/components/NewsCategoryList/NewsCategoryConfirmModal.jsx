import React from "react";
import ConfirmModal from "@/components/common/ConfirmModal";

const NewsCategoryConfirmModal = ({
  open,
  onCancel,
  onConfirm,
  actionType,
}) => {
  const title =
    actionType === "restore"
      ? "Xác nhận khôi phục danh mục"
      : actionType === "force"
      ? "Xác nhận xoá vĩnh viễn danh mục"
      : "Xác nhận xoá danh mục";

  const message =
    actionType === "restore"
      ? "Bạn có chắc chắn muốn khôi phục danh mục này không?"
      : actionType === "force"
      ? "Bạn có chắc chắn muốn xóa vĩnh viễn danh mục này không? Hành động này không thể hoàn tác."
      : "Bạn có chắc chắn muốn xóa danh mục này không?";

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

export default NewsCategoryConfirmModal;
