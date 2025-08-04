import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import TextArea from "@/components/common/TextArea";
import Button from "@/components/common/Button";

const ReplyModal = ({ open, onClose, onSubmit, feedback, loading = false }) => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (feedback) {
      setResponse(feedback.response || "");
    }
  }, [feedback]);

  const handleSubmit = () => {
    onSubmit(response);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Phản hồi người dùng"
    >
      <div className="mb-3 mt-2">
        <p>
          <strong>Nội dung góp ý:</strong> {feedback?.content}
        </p>
      </div>

      <div className="mb-3">
        <TextArea
          label="Nội dung phản hồi"
          rows={4}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Nhập phản hồi tại đây..."
        />
      </div>

      <div className="d-flex justify-content-between">
        <Button
          variant="danger-outline"
          onClick={onClose}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!response.trim()}
          loading={loading}
        >
          Gửi phản hồi
        </Button>
      </div>
    </Modal>
  );
};

export default ReplyModal;
