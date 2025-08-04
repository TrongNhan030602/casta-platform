import React, { useEffect, useState } from "react";
import { formatDateTime } from "@/utils/formatDateTime";
import useAuth from "@/hooks/useAuth";
import axiosClient from "@/services/shared/axiosClient";
import { FiClock, FiMonitor, FiMapPin } from "react-icons/fi";
import "@/assets/styles/layout/enterprise/account/login-history-card.css";

const LoginHistoryCard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchLoginLogs = async () => {
      try {
        const res = await axiosClient.get(`/users/${user.id}/login-logs`);
        setLogs(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử đăng nhập:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginLogs();
  }, [user?.id]);

  return (
    <div className="login-history-card">
      <h3 className="login-history-card__title">Lịch sử đăng nhập</h3>
      {loading ? (
        <p className="login-history-card__loading">Đang tải dữ liệu...</p>
      ) : logs.length === 0 ? (
        <p className="login-history-card__empty">Không có lịch sử đăng nhập.</p>
      ) : (
        <ul className="login-history-card__list">
          {logs.map((log) => (
            <li
              key={log.id}
              className="login-history-card__item"
            >
              <div className="login-history-card__info">
                <FiMapPin className="login-history-card__icon" />
                <span>{log.ip}</span>
              </div>
              <div className="login-history-card__info">
                <FiMonitor className="login-history-card__icon" />
                <span>{log.device}</span>
              </div>
              <div className="login-history-card__info">
                <FiClock className="login-history-card__icon" />
                <span>{formatDateTime(log.logged_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LoginHistoryCard;
