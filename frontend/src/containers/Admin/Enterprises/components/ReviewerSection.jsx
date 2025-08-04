import { MdEmail, MdPerson } from "react-icons/md";
import Badge from "@/components/common/Badge";
import { statusMap, roleLabelMap } from "@/utils/roles";

const ReviewerSection = ({ reviewer }) => {
  if (!reviewer) return null;

  return (
    <section className="enterprise-detail__section">
      <ul className="detail-list">
        <li>
          <strong>
            <MdPerson style={{ marginRight: 4 }} />
            Tên người duyệt:
          </strong>{" "}
          {reviewer.name}
        </li>
        <li>
          <strong>
            <MdEmail style={{ marginRight: 4 }} />
            Email:
          </strong>{" "}
          <a href={`mailto:${reviewer.email}`}>{reviewer.email}</a>
        </li>
        <li>
          <strong>Vai trò:</strong>{" "}
          {roleLabelMap[reviewer.role] || reviewer.role}
        </li>
        <li>
          <strong>Trạng thái:</strong>{" "}
          <Badge
            label={statusMap[reviewer.status]?.label || reviewer.status}
            color={statusMap[reviewer.status]?.color || "gray"}
          />
        </li>
      </ul>
    </section>
  );
};

export default ReviewerSection;
