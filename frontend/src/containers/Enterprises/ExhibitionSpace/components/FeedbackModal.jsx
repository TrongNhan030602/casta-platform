import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import RatingStars from "@/components/common/RatingStars";
import Textarea from "@/components/common/Textarea";
import { toast } from "react-toastify";
import { createFeedback } from "@/services/enterprise/feedbackService";

const FeedbackModal = ({ open, onClose, space, onSuccess }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.warn("Vui lòng nhập nội dung phản hồi.");
      return;
    }
    try {
      setSubmitting(true);
      await createFeedback({
        target_id: space.id,
        content,
        rating,
        type: "space",
      });
      onSuccess?.();
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
      toast.error("Không thể gửi phản hồi. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Gửi phản hồi về: ${space.name}`}
    >
      <div className="mb-3">
        <label className="form-label">Mức độ hài lòng</label>
        <RatingStars
          value={rating}
          onChange={setRating}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Nội dung phản hồi</label>
        <Textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Hãy chia sẻ cảm nhận của bạn về không gian này..."
        />
      </div>

      <div className="modal-footer d-flex justify-content-between">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={submitting}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={submitting}
        >
          Gửi phản hồi
        </Button>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
