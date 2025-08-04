import React, { useState, useEffect, useCallback } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import TextArea from "@/components/common/TextArea";
import DatePicker from "@/components/common/DatePicker";
import { formatDateOnly } from "@/utils/formatDateOnly";
import { formatCurrency } from "@/utils/formatCurrency";
import { previewContractExtension } from "@/services/admin/rentalContractService";

import "@/assets/styles/layout/admin/rental-contract/handle-extend-modal.css";

const HandleExtendModal = ({ open, onClose, onSubmit, loading, contract }) => {
  const [action, setAction] = useState("approve");
  const [newEndDate, setNewEndDate] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [errors, setErrors] = useState({});

  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const fetchPreview = useCallback(
    async (dateStr) => {
      try {
        setPreviewLoading(true);
        const res = await previewContractExtension(contract.id, dateStr);
        setPreview(res.data.data);
        setPreviewError("");
      } catch (error) {
        console.log("🚀 ~ fetchPreview ~ error:", error);
        setPreview(null);
        setPreviewError("Không xem trước được chi phí gia hạn.");
      } finally {
        setPreviewLoading(false);
      }
    },
    [contract]
  );
  useEffect(() => {
    if (open && contract) {
      setAction("approve");

      const currentEnd = new Date(contract.end_date);
      const defaultNewEnd = new Date(currentEnd);
      defaultNewEnd.setDate(defaultNewEnd.getDate() + 7);

      const defaultDateStr = defaultNewEnd.toISOString().split("T")[0];

      setNewEndDate(defaultDateStr);
      setRejectReason("");
      setErrors({});
      setPreview(null);

      if (contract && defaultDateStr) {
        fetchPreview(defaultDateStr);
      }
    }
  }, [open, contract, fetchPreview]);

  useEffect(() => {
    if (!newEndDate || !contract || action !== "approve") return;
    fetchPreview(newEndDate);
  }, [newEndDate, contract, action, fetchPreview]);

  const handleSubmit = () => {
    const newErrors = {};

    if (action === "approve") {
      if (!newEndDate) {
        newErrors.newEndDate = "Vui lòng chọn ngày kết thúc mới.";
      } else {
        const selectedDate = new Date(newEndDate);
        const currentEnd = new Date(contract.end_date);

        if (selectedDate <= currentEnd) {
          newErrors.newEndDate = "Ngày kết thúc mới phải sau ngày hiện tại.";
        }
      }
    }

    if (action === "reject") {
      if (!rejectReason.trim()) {
        newErrors.rejectReason = "Vui lòng nhập lý do từ chối.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      action,
      ...(action === "approve" ? { new_end_date: newEndDate } : {}),
      ...(action === "reject" ? { reject_reason: rejectReason.trim() } : {}),
    };

    onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Xử lý yêu cầu gia hạn hợp đồng"
    >
      <div className="handle-extend-modal">
        <div className="handle-extend-modal__radio mt-2">
          <label>
            <input
              type="radio"
              value="approve"
              checked={action === "approve"}
              onChange={() => setAction("approve")}
            />
            Gia hạn hợp đồng
          </label>
          <label>
            <input
              type="radio"
              value="reject"
              checked={action === "reject"}
              onChange={() => setAction("reject")}
            />
            Từ chối gia hạn
          </label>
        </div>

        {action === "approve" && contract && (
          <div className="handle-extend-modal__field">
            <div className="handle-extend-modal__readonly-date">
              Ngày kết thúc hiện tại:{" "}
              <strong>{formatDateOnly(contract.end_date)}</strong>
            </div>

            <DatePicker
              label="Ngày kết thúc mới (mm/dd/yyyy) *"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              error={errors.newEndDate}
            />

            <div className="handle-extend-modal__hint">
              * Mặc định là <strong>+1 tuần</strong> sau ngày kết thúc hiện tại
            </div>

            {previewLoading ? (
              <div className="handle-extend-modal__preview loading">
                Đang tính chi phí...
              </div>
            ) : preview ? (
              <div className="handle-extend-modal__preview">
                <p>
                  🔎 <strong>Thông tin chi phí gia hạn:</strong>
                </p>
                <ul>
                  <li>
                    Số ngày gia hạn: <strong>{preview.added_days} ngày</strong>
                  </li>
                  <li>
                    Đơn giá mỗi ngày:{" "}
                    <strong>{formatCurrency(preview.unit_price)} </strong>
                  </li>
                  <li>
                    Chi phí thêm:{" "}
                    <strong>{formatCurrency(preview.added_cost)}</strong>
                  </li>
                  <li>
                    Tổng chi phí mới:{" "}
                    <strong>{formatCurrency(preview.new_total_cost)}</strong>
                  </li>
                </ul>
              </div>
            ) : previewError ? (
              <div className="handle-extend-modal__preview error">
                {previewError}
              </div>
            ) : null}
          </div>
        )}

        {action === "reject" && (
          <TextArea
            label="Lý do từ chối *"
            value={rejectReason}
            onChange={(e) => {
              setRejectReason(e.target.value);
              if (errors.rejectReason) {
                setErrors((prev) => ({ ...prev, rejectReason: "" }));
              }
            }}
            error={errors.rejectReason}
            placeholder="Nhập lý do từ chối..."
            rows={4}
          />
        )}

        <div className="handle-extend-modal__actions">
          <Button
            variant="danger-outline"
            onClick={onClose}
            disabled={loading}
            className="handle-extend-modal__btn"
          >
            Hủy
          </Button>
          <Button
            variant={action === "approve" ? "primary" : "danger"}
            onClick={handleSubmit}
            disabled={loading}
            className="handle-extend-modal__btn"
          >
            {loading
              ? "Đang xử lý..."
              : action === "approve"
              ? "Xác nhận gia hạn"
              : "Xác nhận từ chối"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HandleExtendModal;
