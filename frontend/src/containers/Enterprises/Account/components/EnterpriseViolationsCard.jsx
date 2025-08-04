import React, { useEffect, useState } from "react";
import { getMyViolations } from "@/services/enterprise/enterpriseService";
import { formatDateTime } from "@/utils/formatDateTime";
import { FiAlertTriangle } from "react-icons/fi";
import "@/assets/styles/layout/enterprise/account/violations-card.css";

const EnterpriseViolationsCard = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const res = await getMyViolations();
        setViolations(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy cảnh báo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  return (
    <div className="violations-card">
      <h3 className="violations-card__title">Cảnh báo hệ thống</h3>

      {violations.length >= 3 && (
        <div className="violations-card__critical-warning">
          <FiAlertTriangle className="violations-card__critical-icon" />
          <div>
            <p className="violations-card__critical-text">
              Tài khoản của bạn đã{" "}
              <strong>vi phạm {violations.length} lần</strong>. Nếu không khắc
              phục, tài khoản có thể bị <strong>khóa vĩnh viễn</strong>.
            </p>
            <p className="violations-card__critical-note">
              Vui lòng rà soát lại nội dung bị cảnh báo hoặc liên hệ quản trị
              viên để được hỗ trợ.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="violations-card__loading">Đang tải dữ liệu...</p>
      ) : violations.length === 0 ? (
        <p className="violations-card__empty">Không có cảnh báo nào.</p>
      ) : (
        <ul className="violations-card__list">
          {violations.map((v) => (
            <li
              key={v.id}
              className="violations-card__item"
            >
              <div className="violations-card__icon">
                <FiAlertTriangle />
              </div>
              <div className="violations-card__content">
                <div className="violations-card__reason">{v.reason}</div>
                <div className="violations-card__details">{v.details}</div>
                <div className="violations-card__date">
                  Bị cảnh báo lúc: {formatDateTime(v.created_at)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EnterpriseViolationsCard;
