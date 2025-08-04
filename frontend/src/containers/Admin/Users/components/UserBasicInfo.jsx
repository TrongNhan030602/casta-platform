import React from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import Badge from "@/components/common/Badge";
import { roleColorMap, roleLabelMap, statusMap } from "@/utils/roles";
import { formatDateTime } from "@/utils/formatDateTime";

const UserBasicInfo = ({ user }) => (
  <div>
    <ul>
      <li>
        <strong>Tên đăng nhập:</strong> {user.name}
      </li>
      <li>
        <strong>Email:</strong> {user.email}
      </li>
      <li>
        <strong>Vai trò:</strong>{" "}
        <Badge
          label={roleLabelMap[user.role] || user.role}
          color={roleColorMap[user.role] || "gray"}
        />
      </li>
      <li>
        <strong>Trạng thái:</strong>{" "}
        <Badge
          label={statusMap[user.status]?.label || user.status}
          color={statusMap[user.status]?.color || "gray"}
        />
      </li>
      <li>
        <strong>Xác thực email:</strong>{" "}
        {user.email_verified_at ? (
          <>
            <FiCheckCircle style={{ color: "green", marginRight: 4 }} />(
            {formatDateTime(user.email_verified_at)})
          </>
        ) : (
          <>
            <FiXCircle style={{ color: "red", marginRight: 4 }} />
            Chưa xác thực
          </>
        )}
      </li>
    </ul>
  </div>
);

export default UserBasicInfo;
