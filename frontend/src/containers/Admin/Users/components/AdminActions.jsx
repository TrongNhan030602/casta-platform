import React from "react";
import Button from "@/components/common/Button";

const AdminActions = ({
  onChangeStatus,
  onAssignRole,
  onSendWarning,
  isLoading = false,
}) => {
  return (
    <div className="section admin-actions">
      <h3>Thao tác quản trị</h3>
      <div className="action-buttons">
        <Button
          size="sm"
          variant="danger-outline"
          onClick={onChangeStatus}
          disabled={isLoading}
        >
          Đổi trạng thái
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={onAssignRole}
          disabled={isLoading}
        >
          Phân quyền
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onSendWarning}
          disabled={isLoading}
        >
          Gửi cảnh báo
        </Button>
      </div>
    </div>
  );
};

export default AdminActions;
