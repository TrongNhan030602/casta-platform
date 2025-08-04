import React from "react";
import { MdEmail, MdCheckCircle } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import Badge from "@/components/common/Badge";
import { formatDateTime } from "@/utils/formatDateTime";
import { roleLabelMap, roleColorMap, statusMap } from "@/utils/roles";

const LinkedAccountSection = ({ user }) => {
  if (!user) return null;

  const { name, email, status, email_verified_at, created_at, role } = user;

  return (
    <section className="enterprise-detail__section">
      <ul className="detail-list">
        <li>
          <strong>
            <FaUser /> Tên đăng nhập:
          </strong>{" "}
          {name}
        </li>
        <li>
          <strong>
            <MdEmail /> Email:
          </strong>{" "}
          <a href={`mailto:${email}`}>{email}</a>
        </li>
        <li>
          <strong>Trạng thái tài khoản:</strong>{" "}
          <Badge
            label={statusMap[status]?.label || status}
            color={statusMap[status]?.color || "gray"}
          />
        </li>
        <li>
          <strong>Đã xác minh email:</strong>{" "}
          {email_verified_at ? (
            <>
              <MdCheckCircle
                color="green"
                style={{ marginRight: 4 }}
              />
              {formatDateTime(email_verified_at)}
            </>
          ) : (
            <span style={{ color: "red" }}>Chưa xác minh</span>
          )}
        </li>
        <li>
          <strong>Ngày tạo tài khoản:</strong> {formatDateTime(created_at)}
        </li>
        <li>
          <strong>Vai trò:</strong>{" "}
          <Badge
            label={roleLabelMap[role] || role}
            color={roleColorMap[role] || "gray"}
          />
        </li>
      </ul>
    </section>
  );
};

export default LinkedAccountSection;
