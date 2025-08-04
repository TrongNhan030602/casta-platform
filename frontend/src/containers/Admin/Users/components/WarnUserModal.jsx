import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import TextArea from "@/components/common/TextArea";
import Button from "@/components/common/Button";
import { warnUser } from "@/services/admin/violationService";
import { toast } from "react-toastify";

const WarnUserModal = ({ open, onClose, user, onWarned }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset form mỗi khi modal được mở
  useEffect(() => {
    if (open) {
      setReason("");
      setDetails("");
      setSubmitted(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!reason.trim()) return;

    setLoading(true);
    try {
      await warnUser(user.id, { reason, details });
      toast.success("Đã gửi cảnh báo");
      onWarned?.();
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Không thể gửi cảnh báo lúc này"
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý phím Ctrl + Enter trong TextArea
  const handleTextAreaKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      (e.ctrlKey || e.metaKey) &&
      !loading &&
      reason.trim()
    ) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Cảnh báo người dùng #${user?.id}`}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ padding: "12px" }}>
          <TextArea
            label="Lý do *"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onKeyDown={handleTextAreaKeyDown}
            rows={3}
            error={submitted && !reason.trim() ? "Không được để trống" : null}
          />
          <TextArea
            label="Chi tiết (không bắt buộc)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            onKeyDown={handleTextAreaKeyDown}
            rows={4}
          />
          <div
            style={{
              marginTop: 8,
              color: "#666",
              fontSize: "0.9em",
              textAlign: "left",
            }}
          >
            Nhấn <strong>Ctrl + Enter</strong> để submit nhanh
          </div>
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi cảnh báo"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default WarnUserModal;
