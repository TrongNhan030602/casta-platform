import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaInfoCircle, FaReply, FaTrashAlt, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getFeedbacksByTarget,
  deleteFeedback,
  replyFeedback,
} from "@/services/admin/feedbackService";
import { formatDateTime } from "@/utils/formatDateTime";
import {
  getTypeLabel,
  getStatusLabel,
  FEEDBACK_STATUSES,
  FEEDBACK_STATUS_COLORS,
} from "@/constants/feedback";

import CommonFilterBar from "@/components/common/FilterBar";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import ConfirmModal from "@/components/common/ConfirmModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ReplyModal from "@/containers/Admin/Feedbacks/components/ReplyModal";

import "@/assets/styles/layout/admin/exhibition-space/feedback-tab.css";

const FeedbackTab = ({ spaceId, filters }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    if (!spaceId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getFeedbacksByTarget({
          type: "space",
          target_id: spaceId,
          status: filters.status || undefined,
          keyword: filters.keyword || undefined,
          sort_by: filters.sort_by || "created_at",
          sort_order: filters.sort_order || "desc",
          per_page: filters.perPage || 10,
        });
        setFeedbacks(res.data?.data || []);
      } catch (err) {
        console.error("Lỗi khi tải phản hồi:", err);
        toast.error("Lỗi khi tải phản hồi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [spaceId, filters]);

  const handleDelete = async () => {
    try {
      await deleteFeedback(selectedId);
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== selectedId));
      toast.success("Đã xoá phản hồi thành công");
    } catch (err) {
      console.error("Xoá thất bại:", err);
      toast.error("Xoá phản hồi thất bại");
    } finally {
      setConfirmOpen(false);
      setSelectedId(null);
    }
  };

  const handleReply = (id) => {
    const fb = feedbacks.find((f) => f.id === id);
    if (fb) {
      setSelectedFeedback(fb);
      setReplyModalOpen(true);
    }
  };

  const handleSubmitReply = async (response) => {
    if (!selectedFeedback?.id) return;
    try {
      setReplying(true);
      await replyFeedback(selectedFeedback.id, response.trim());
      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === selectedFeedback.id
            ? { ...fb, response, status: FEEDBACK_STATUSES.RESOLVED }
            : fb
        )
      );
      toast.success("Phản hồi thành công");
    } catch (err) {
      console.error("Phản hồi thất bại:", err);
      toast.error("Phản hồi thất bại");
    } finally {
      setReplying(false);
      setReplyModalOpen(false);
      setSelectedFeedback(null);
    }
  };

  return (
    <>
      <div className="feedback-tab">
        {loading ? (
          <LoadingSpinner text="Đang tải phản hồi..." />
        ) : feedbacks.length === 0 ? (
          <p className="text-muted">Chưa có phản hồi nào.</p>
        ) : (
          feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="feedback-card card mb-3"
            >
              <div className="card-body">
                <div className="feedback-card__header d-flex justify-content-between align-items-center">
                  <div className="feedback-card__user">
                    <strong>{fb.user?.name || "Ẩn danh"}</strong>
                    <Badge
                      label={getTypeLabel(fb.type)}
                      color="secondary"
                      className="ms-2"
                    />
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge
                      label={getStatusLabel(fb.status)}
                      color={FEEDBACK_STATUS_COLORS[fb.status] || "dark"}
                    />
                    <Link
                      to={`/admin/feedbacks/${fb.id}`}
                      title="Xem chi tiết"
                      className="btn btn-outline-success btn-sm d-flex align-items-center justify-content-center p-1"
                      style={{ width: "28px", height: "28px" }}
                    >
                      <FaInfoCircle />
                    </Link>
                  </div>
                </div>

                <div className="feedback-card__content mt-2">
                  <p>{fb.content}</p>
                </div>

                <div className="feedback-card__rating mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < fb.rating ? "text-warning" : "text-muted"}
                    />
                  ))}
                </div>

                {fb.response && (
                  <div className="feedback-card__response mt-2 p-2 bg-light rounded">
                    <strong>Phản hồi:</strong> {fb.response}
                  </div>
                )}

                <div className="feedback-card__footer d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted fst-italic">
                    {formatDateTime(fb.created_at)}
                  </small>
                  <div className="feedback-card__actions d-flex gap-2">
                    {fb.status === FEEDBACK_STATUSES.NEW && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReply(fb.id)}
                      >
                        <FaReply className="me-1" />
                        Phản hồi
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedId(fb.id);
                        setConfirmOpen(true);
                      }}
                    >
                      <FaTrashAlt className="me-1" />
                      Xoá
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <ConfirmModal
          open={confirmOpen}
          title="Xác nhận xoá phản hồi"
          message="Bạn có chắc chắn muốn xoá phản hồi này không?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />

        <ReplyModal
          open={replyModalOpen}
          feedback={selectedFeedback}
          onClose={() => setReplyModalOpen(false)}
          onSubmit={handleSubmitReply}
          loading={replying}
        />
      </div>
    </>
  );
};

export default FeedbackTab;
