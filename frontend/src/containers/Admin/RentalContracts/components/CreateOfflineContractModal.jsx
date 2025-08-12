import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import DatePicker from "@/components/common/DatePicker";
import SelectBox from "@/components/common/SelectBox";
import { toast } from "react-toastify";
import { parseISO, differenceInDays, isBefore } from "date-fns";
import { getSimpleApprovedEnterprises } from "@/services/admin/enterpriseService";
import { createOfflineRentalContract } from "@/services/admin/rentalContractService";
import { getSelectableExhibitionSpaces } from "@/services/admin/exhibitionSpaceService";

const CreateOfflineContractModal = ({ open, onClose, onCreated }) => {
  const [enterprises, setEnterprises] = useState([]);
  const [spaces, setSpaces] = useState([]);

  const [form, setForm] = useState({
    enterprise_id: "",
    exhibition_space_id: "",
    start_date: "",
    end_date: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    getSimpleApprovedEnterprises()
      .then((res) => setEnterprises(res.data?.data || []))
      .catch(() => toast.error("Không thể tải danh sách doanh nghiệp"));

    getSelectableExhibitionSpaces()
      .then((res) => setSpaces(res.data || []))
      .catch(() => toast.error("Không thể tải danh sách không gian"));
  }, [open]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const rentalSummary = useMemo(() => {
    const { start_date, end_date, exhibition_space_id } = form;
    if (!start_date || !end_date || !exhibition_space_id) return null;

    try {
      const start = parseISO(start_date);
      const end = parseISO(end_date);
      if (isBefore(end, start)) return null;

      const days = differenceInDays(end, start) + 1;
      const space = spaces.find((s) => s.id === exhibition_space_id);
      if (!space || !space.price) return null;

      const unitPrice = space.price;
      const totalCost = unitPrice * days;

      return { unitPrice, days, totalCost };
    } catch (error) {
      console.log("🚀 ~ CreateOfflineContractModal ~ error:", error);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.start_date, form.end_date, form.exhibition_space_id, spaces]);

  const handleSubmit = async () => {
    const newErrors = {};
    const requiredFields = [
      "enterprise_id",
      "exhibition_space_id",
      "start_date",
      "end_date",
    ];
    requiredFields.forEach((key) => {
      if (!form[key]) newErrors[key] = "Trường này là bắt buộc";
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await createOfflineRentalContract(form);
      toast.success("Tạo hợp đồng offline thành công");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không thể tạo hợp đồng offline"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tạo hợp đồng thuê offline"
    >
      <div className="d-flex flex-column gap-3">
        <SelectBox
          label="Doanh nghiệp *"
          options={enterprises.map((e) => ({ label: e.name, value: e.id }))}
          value={form.enterprise_id}
          onChange={(val) => handleChange("enterprise_id", val)}
          error={errors.enterprise_id}
          required
        />

        <SelectBox
          label="Không gian *"
          options={spaces.map((s) => ({ label: s.name, value: s.id }))}
          value={form.exhibition_space_id}
          onChange={(val) => handleChange("exhibition_space_id", val)}
          error={errors.exhibition_space_id}
          required
        />

        <DatePicker
          label="Ngày bắt đầu *"
          value={form.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
          error={errors.start_date}
        />

        <DatePicker
          label="Ngày kết thúc *"
          value={form.end_date}
          onChange={(e) => handleChange("end_date", e.target.value)}
          error={errors.end_date}
        />

        {rentalSummary && (
          <div className="p-3 border rounded bg-light text-dark">
            <div>
              Đơn giá:{" "}
              <strong>
                {rentalSummary.unitPrice.toLocaleString()} VNĐ / ngày
              </strong>
            </div>
            <div>
              Số ngày: <strong>{rentalSummary.days}</strong>
            </div>
            <div>
              Tổng chi phí:{" "}
              <strong>{rentalSummary.totalCost.toLocaleString()} VNĐ</strong>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            variant="danger-outline"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo hợp đồng"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateOfflineContractModal;
