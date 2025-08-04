import { Link } from "react-router-dom";
import Badge from "@/components/common/Badge";
import RatingStars from "@/components/common/RatingStars";
import { formatDateTime } from "@/utils/formatDateTime";
import { getTypeLabel, getStatusLabel } from "@/constants/feedback";
const FeedbackGeneralInfo = ({ feedback }) => {
  const getBadgeColor = (status) => {
    switch (status) {
      case "new":
        return "warning";
      case "reviewed":
        return "info";
      case "resolved":
        return "success";
      default:
        return "gray";
    }
  };

  return (
    <div className="feedback-detail__section">
      <div className="feedback-general">
        <h2 className="feedback-detail__section-title">Thông tin phản hồi</h2>

        <div className="feedback-general__row">
          <strong>Loại:</strong> {getTypeLabel(feedback.type)}
        </div>

        <div className="feedback-general__row">
          <strong>Nội dung:</strong> {feedback.content}
        </div>

        <div className="feedback-general__row d-flex align-items-center gap-2">
          <strong className="me-2">Đánh giá:</strong>
          <RatingStars value={feedback.rating} />
        </div>

        <div className="feedback-general__row">
          <strong>Trạng thái:</strong>{" "}
          <Badge
            label={getStatusLabel(feedback.status)}
            color={getBadgeColor(feedback.status)}
          />
        </div>

        {feedback.response && (
          <div className="feedback-general__row">
            <strong>Phản hồi:</strong> {feedback.response}
          </div>
        )}

        <div className="feedback-general__row">
          <strong>Người gửi:</strong>{" "}
          <Link
            to={`/admin/users/${feedback.user.id}`}
            className="feedback-general__user-link"
          >
            {feedback.user.name}
          </Link>
        </div>

        <div className="feedback-general__row">
          <strong>Ngày gửi:</strong> {formatDateTime(feedback.created_at)}
        </div>
      </div>
    </div>
  );
};

export default FeedbackGeneralInfo;
