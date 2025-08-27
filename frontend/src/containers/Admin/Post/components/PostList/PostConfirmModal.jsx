// @/components/admin/posts/PostConfirmModal.jsx
import React from "react";
import ConfirmModal from "@/components/common/ConfirmModal";

const PostConfirmModal = ({ open, onCancel, onConfirm, actionType }) => {
  const title =
    actionType === "restore"
      ? "Xác nhận khôi phục bài viết"
      : actionType === "force"
      ? "Xác nhận xoá vĩnh viễn bài viết"
      : "Xác nhận xoá bài viết";

  const message =
    actionType === "restore"
      ? "Bạn có chắc chắn muốn khôi phục bài viết này không?"
      : actionType === "force"
      ? "Bạn có chắc chắn muốn xóa vĩnh viễn bài viết này không? Hành động này không thể hoàn tác."
      : "Bạn có chắc chắn muốn xóa bài viết này không?";

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

export default PostConfirmModal;
