import { Link } from "react-router-dom";
import { EXHIBITION_SPACE_STATUSES } from "@/constants/exhibitionStatus";
import Badge from "@/components/common/Badge";
const FeedbackTargetInfo = ({ feedback }) => {
  const { type, target_detail } = feedback;
  if (!target_detail) return null;

  const getTargetDetailPath = (type, id) => {
    switch (type) {
      case "space":
        return `/admin/exhibition-spaces/${id}`;
      case "enterprise":
        return `/admin/enterprises/${id}`;
      case "product":
        return `/admin/products/${id}`;
      default:
        return "#";
    }
  };

  return (
    <div className="feedback-detail__section">
      <div className="feedback-target">
        <h2 className="feedback-detail__section-title">
          Thông tin đối tượng phản hồi
        </h2>

        <div className="feedback-target__row">
          <strong>Tên:</strong>{" "}
          <Link
            to={getTargetDetailPath(type, target_detail.id)}
            className="feedback-general__user-link"
          >
            {target_detail.name}
          </Link>{" "}
        </div>

        {type === "space" && (
          <>
            <div className="feedback-target__row">
              <strong>Khu vực:</strong> {target_detail.zone}
            </div>
            <div className="feedback-target__row">
              <strong>Vị trí:</strong> {target_detail.location}
            </div>
            <div className="feedback-target__row">
              <strong>Trạng thái:</strong>{" "}
              <Badge
                label={
                  EXHIBITION_SPACE_STATUSES[target_detail.status]?.label ||
                  "Không xác định"
                }
                color={
                  EXHIBITION_SPACE_STATUSES[target_detail.status]?.color ||
                  "gray"
                }
              />
            </div>
          </>
        )}

        {type === "product" && (
          <>
            <div className="feedback-target__row">
              <strong>Mô tả:</strong> {target_detail.description}
            </div>
            <div className="feedback-target__row">
              <strong>Giá:</strong> {target_detail.price}đ
            </div>
            <div className="feedback-target__row">
              <strong>Tồn kho:</strong> {target_detail.stock}
            </div>
          </>
        )}

        {type === "enterprise" && (
          <>
            <div className="feedback-target__row">
              <strong>Người đại diện:</strong> {target_detail.representative}
            </div>
            <div className="feedback-target__row">
              <strong>Email:</strong> {target_detail.email}
            </div>
            <div className="feedback-target__row">
              <strong>SĐT:</strong> {target_detail.phone}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackTargetInfo;
