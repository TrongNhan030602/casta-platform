import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Modal from "@/components/common/Modal";
import SelectBox from "@/components/common/SelectBox";
import FormGroup from "@/components/common/FormGroup";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import { PRODUCT_STATUSES } from "@/constants/productStatus";

// Mô tả ý nghĩa các trạng thái
const STATUS_DESCRIPTIONS = {
  draft: "Chỉ lưu nháp, chưa gửi duyệt.",
  pending: "Đang chờ quản trị viên duyệt.",
  published: "Hiển thị công khai trên hệ thống.",
  rejected: "Đã bị từ chối, cần chỉnh sửa để gửi lại.",
  disabled: "Ẩn tạm thời, không còn hiển thị cho khách hàng.",
};

// Quy định chuyển đổi trạng thái hợp lệ (giống backend)
const getAvailableTransitions = (currentStatus) => {
  if (!currentStatus) return [];
  switch (currentStatus) {
    case "draft":
      return [PRODUCT_STATUSES.pending];
    case "pending":
      return [PRODUCT_STATUSES.published, PRODUCT_STATUSES.rejected];
    case "rejected":
      return [PRODUCT_STATUSES.pending];
    case "published":
      return [PRODUCT_STATUSES.disabled];
    case "disabled":
      return [PRODUCT_STATUSES.published];
    default:
      return [];
  }
};

// Schema validate form
const schema = yup.object().shape({
  status: yup.string().required("Vui lòng chọn trạng thái"),
  reason_rejected: yup.string().when("status", {
    is: "rejected",
    then: (schema) => schema.required("Vui lòng nhập lý do từ chối"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const UpdateProductStatusModal = ({
  open,
  onCancel,
  onSubmit,
  currentStatus = "pending", // ✅ đã đổi tên
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: currentStatus,
      reason_rejected: "",
    },
  });

  const selectedStatus = watch("status");

  // Reset lại form khi modal mở với trạng thái mới
  useEffect(() => {
    if (open) {
      reset({
        status: currentStatus,
        reason_rejected: "",
      });
    }
  }, [open, currentStatus, reset]);

  // Chỉ hiển thị trạng thái hợp lệ để chuyển đổi
  const statusOptions = useMemo(() => {
    return getAvailableTransitions(currentStatus).map((s) => ({
      ...s,
      label: `${s.label} – ${STATUS_DESCRIPTIONS[s.value] || ""}`,
    }));
  }, [currentStatus]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    onCancel();
    reset();
  };

  return (
    <Modal
      open={open}
      title="Cập nhật trạng thái sản phẩm"
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormGroup
          label="Trạng thái"
          error={errors.status?.message}
          className="w-100"
        >
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectBox
                className="w-100"
                options={statusOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.status?.message}
              />
            )}
          />
        </FormGroup>

        {selectedStatus === "rejected" && (
          <FormGroup
            label="Lý do từ chối"
            error={errors.reason_rejected?.message}
          >
            <Textarea
              className="w-100"
              rows={3}
              {...register("reason_rejected")}
            />
          </FormGroup>
        )}

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Hủy
          </Button>
          <Button type="submit">Cập nhật</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateProductStatusModal;
