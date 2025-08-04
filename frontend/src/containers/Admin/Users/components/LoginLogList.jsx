import { useState } from "react";
import { toast } from "react-toastify";
import { deleteLoginLogById } from "@/services/admin/userService";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import { formatDateTime } from "@/utils/formatDateTime";

const LoginLogList = ({ logs, onDeleted, canDelete = true }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmingLogId, setConfirmingLogId] = useState(null);

  const handleConfirmDelete = async () => {
    if (!confirmingLogId) return;
    setDeletingId(confirmingLogId);

    try {
      await deleteLoginLogById(confirmingLogId);
      toast.success("Xoá log đăng nhập thành công.");
      onDeleted?.(confirmingLogId);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Xoá log thất bại.");
    } finally {
      setDeletingId(null);
      setConfirmingLogId(null);
    }
  };

  return (
    <div>
      {logs.length > 0 ? (
        <ul className="log-list divide-y">
          {logs.map((log) => (
            <li
              key={log.id}
              className="flex items-center py-3 gap-4"
            >
              {/* Nội dung bên trái */}
              <div className="flex-1">
                <div className="font-mono text-sm text-gray-800">{log.ip}</div>
                <div className="text-xs text-gray-500 break-all">
                  {log.device}
                </div>
                <div className="text-xs text-gray-400">
                  {formatDateTime(log.logged_at)}
                </div>
              </div>

              {/* Nút xoá bên phải */}
              {canDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  radius="rounded"
                  onClick={() => setConfirmingLogId(log.id)}
                  disabled={deletingId === log.id}
                  className="shrink-0"
                >
                  {deletingId === log.id ? "Đang xoá..." : "Xoá"}
                </Button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-data text-sm text-gray-500">Chưa có log đăng nhập</p>
      )}

      <ConfirmModal
        open={!!confirmingLogId}
        title="Xác nhận xoá log"
        message="Bạn có chắc chắn muốn xoá log đăng nhập này không?"
        onCancel={() => setConfirmingLogId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default LoginLogList;
