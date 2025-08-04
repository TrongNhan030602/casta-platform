import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ FIX: sử dụng hook đúng cách
import Button from "@/components/common/Button";
import ReplyModal from "./ReplyModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "react-toastify";
import {
  replyFeedback,
  deleteFeedback,
} from "@/services/admin/feedbackService";

const FeedbackActions = ({ feedback }) => {
  const navigate = useNavigate();
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==== PHẢN HỒI ====
  const handleOpenReply = () => setShowReplyModal(true);
  const handleCloseReply = () => setShowReplyModal(false);

  const handleReplySubmit = async (response) => {
    try {
      setLoading(true);
      await replyFeedback(feedback.id, response);
      toast.success("Phản hồi đã được gửi");
      setShowReplyModal(false);
      navigate(0);
    } catch (error) {
      console.error("Gửi phản hồi thất bại:", error);
      toast.error("Gửi phản hồi thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ==== XOÁ ====
  const handleOpenDeleteConfirm = () => setShowConfirmModal(true);
  const handleCloseDeleteConfirm = () => setShowConfirmModal(false);

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteFeedback(feedback.id);
      toast.success("Đã xoá phản hồi");
      setShowConfirmModal(false);
      navigate("/admin/feedbacks");
    } catch (error) {
      console.error("Xoá phản hồi thất bại:", error);
      toast.error("Xoá phản hồi thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-detail__section">
      <h2 className="feedback-detail__section-title">Hành động</h2>

      <div className="feedback-actions">
        {feedback.status === "new" && (
          <div className="feedback-actions__row">
            <Button
              onClick={handleOpenReply}
              variant="outline"
              disabled={loading}
            >
              Trả lời phản hồi
            </Button>
          </div>
        )}

        <div className="feedback-actions__row">
          <Button
            onClick={handleOpenDeleteConfirm}
            variant="danger-outline"
            disabled={loading}
          >
            Xoá phản hồi
          </Button>
        </div>
      </div>

      {/* Modal phản hồi */}
      <ReplyModal
        open={showReplyModal}
        onClose={handleCloseReply}
        onSubmit={handleReplySubmit}
        feedback={feedback}
        loading={loading}
      />

      {/* Modal xác nhận xoá */}
      <ConfirmModal
        open={showConfirmModal}
        onCancel={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Xoá phản hồi"
        message={`Bạn có chắc chắn muốn xoá phản hồi của "${feedback.user?.name}"?`}
      />
    </div>
  );
};

export default FeedbackActions;
