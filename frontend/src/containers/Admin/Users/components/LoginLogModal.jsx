import React, { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { fetchLoginLogs } from "@/services/admin/userService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const LoginLogModal = ({ userId, open, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !open) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await fetchLoginLogs(userId);
        setLogs(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy log đăng nhập:", err);
        toast.error("Không thể tải log đăng nhập");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [userId, open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Lịch sử đăng nhập"
    >
      {loading ? (
        <p>Đang tải log...</p>
      ) : logs.length === 0 ? (
        <p>Không có log đăng nhập.</p>
      ) : (
        <ul className="login-log-list">
          {logs.map((log, index) => (
            <li
              key={index}
              className="login-log-item"
            >
              <div className="log-datetime">
                {format(new Date(log.logged_at), "dd/MM/yyyy HH:mm:ss")} – IP:{" "}
                <strong>{log.ip}</strong>
              </div>
              <div className="log-device">Thiết bị: {log.device}</div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default LoginLogModal;
