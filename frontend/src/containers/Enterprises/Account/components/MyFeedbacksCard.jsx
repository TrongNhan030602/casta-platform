import React, { useEffect, useState } from "react";
import { getMyFeedbacks } from "@/services/enterprise/feedbackService";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { formatDateOnly } from "@/utils/formatDateOnly";
import RatingStars from "@/components/common/RatingStars";

const MyFeedbacksCard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    getMyFeedbacks({ page: 1, per_page: 5 })
      .then((res) => {
        setFeedbacks(res.data?.data);
        setMeta(res.data.meta);
      })
      .catch((err) => console.error("Lỗi lấy phản hồi:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Phản hồi đã gửi</h5>
        {meta && meta.total > 0 && (
          <span className="badge bg-secondary">{meta.total}</span>
        )}
      </div>

      <div className="card-body">
        {loading ? (
          <LoadingSpinner text="Đang tải phản hồi..." />
        ) : feedbacks.length === 0 ? (
          <p>Bạn chưa gửi phản hồi nào.</p>
        ) : (
          <div className="list-group">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="list-group-item"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{fb.target_name}</strong>
                  <small>{formatDateOnly(fb.created_at)}</small>
                </div>
                <div className="mb-1">
                  <RatingStars
                    value={fb.rating}
                    max={5}
                  />
                </div>
                <p
                  className="mb-1 text-muted"
                  style={{ fontSize: 14 }}
                >
                  {fb.content.length > 100
                    ? fb.content.slice(0, 100) + "..."
                    : fb.content}
                </p>
                {fb.response && (
                  <div className="alert alert-info mt-2 mb-0 p-2">
                    <strong>Phản hồi từ quản trị:</strong> {fb.response}
                  </div>
                )}
              </div>
            ))}
            {meta?.total > 5 && (
              <div className="text-end mt-2">
                <a
                  href="/enterprise/feedbacks"
                  className="btn btn-link btn-sm"
                >
                  Xem tất cả →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFeedbacksCard;
