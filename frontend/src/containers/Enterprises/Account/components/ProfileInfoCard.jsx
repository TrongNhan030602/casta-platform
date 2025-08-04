import React from "react";
import useAuth from "@/hooks/useAuth";
import Badge from "@/components/common/Badge";
import { roleLabelMap, statusMap, roleColorMap } from "@/utils/roles";
import { formatDateTime } from "@/utils/formatDateTime";
const ProfileInfoCard = () => {
  const { user } = useAuth();

  const role = user.role?.toLowerCase();
  const status = user.status?.toLowerCase();

  return (
    <div className="account-card">
      <h3 className="account-card__title">Thông tin tài khoản</h3>
      <ul className="account-card__list">
        <li className="account-card__item">
          <span className="account-card__label">Tên người dùng:</span>
          <span className="account-card__value">{user.name}</span>
        </li>

        <li className="account-card__item">
          <span className="account-card__label">Email:</span>
          <span className="account-card__value">{user.email}</span>
        </li>

        <li className="account-card__item">
          <span className="account-card__label">Vai trò:</span>
          <span className="account-card__value">
            <Badge
              label={roleLabelMap[role] || role?.toUpperCase() || "Không rõ"}
              color={roleColorMap[role] || "gray"}
            />
          </span>
        </li>

        <li className="account-card__item">
          <span className="account-card__label">Trạng thái tài khoản:</span>
          <span className="account-card__value">
            <Badge
              label={statusMap[status]?.label || status}
              color={statusMap[status]?.color || "gray"}
            />
          </span>
        </li>

        <li className="account-card__item">
          <span className="account-card__label">Ngày tạo:</span>
          <span className="account-card__value">
            {formatDateTime(user.created_at)}
          </span>
        </li>

        <li className="account-card__item">
          <span className="account-card__label">Xác minh email:</span>
          <span className="account-card__value">
            {user.email_verified ? (
              <Badge
                label="Đã xác minh"
                color="success"
              />
            ) : (
              <Badge
                label="Chưa xác minh"
                color="warning"
              />
            )}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default ProfileInfoCard;
