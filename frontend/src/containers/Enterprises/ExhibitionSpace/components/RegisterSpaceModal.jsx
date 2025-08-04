import React, { useState } from "react";
import { differenceInDays } from "date-fns";
import { toast } from "react-toastify";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { createRentalContract } from "@/services/enterprise/rentalContractService";
import DatePicker from "@/components/common/DatePicker";

import "@/assets/styles/layout/enterprise/exhibition-space/register-space-modal.css";

const RegisterSpaceModal = ({ open, onClose, space, onSuccess }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const payload = {
      exhibition_space_id: space.id,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      setLoading(true);
      await createRentalContract(payload);
      toast.success("Gửi yêu cầu thành công!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickSubmit = () => {
    if (!startDate || !endDate) {
      toast.warn("Vui lòng chọn ngày bắt đầu và kết thúc.");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.warn("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    handleSubmit();
  };

  const estimateCost = () => {
    const days = differenceInDays(new Date(endDate), new Date(startDate)) + 1;
    return days > 0 ? days * space.price : null;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Đăng ký thuê không gian"
    >
      <div className="register-modal">
        <div className="register-modal__info">
          <p className="register-modal__space">
            <strong>{space.name}</strong> ({space.code}) –{" "}
            <span className="register-modal__price">
              {Number(space.price).toLocaleString("vi-VN")} đ/ngày
            </span>
          </p>
        </div>

        <DatePicker
          label="Ngày bắt đầu"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />

        <DatePicker
          label="Ngày kết thúc"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate || new Date().toISOString().split("T")[0]}
        />

        {startDate && endDate && new Date(endDate) > new Date(startDate) && (
          <p className="register-modal__estimate">
            <strong>Chi phí ước tính: </strong>
            <span className="register-modal__cost">
              {Number(estimateCost()).toLocaleString("vi-VN")} đ
            </span>
          </p>
        )}

        <div className="register-modal__actions d-flex justify-content-end mt-4">
          <Button
            variant="danger-outline"
            onClick={onClose}
            className="me-2"
          >
            Hủy
          </Button>
          <Button
            onClick={handleClickSubmit}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterSpaceModal;
