import React from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import FormGroup from "@/components/common/FormGroup";
import SwitchToggle from "@/components/common/SwitchToggle";
import SelectBox from "@/components/common/SelectBox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productAdjustStockSchema } from "@/validations/enterprise/product";
import { adjustProductStock } from "@/services/enterprise/productService";
import { toast } from "react-toastify";
import { STOCK_TYPES, STOCK_TYPE_OPTIONS } from "@/constants/stockTypes";

const ProductAdjustStockModal = ({ open, onClose, productId, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(productAdjustStockSchema),
    defaultValues: {
      type: "import",
      quantity: 1,
      unit_price: null,
      affect_cost: false,
      note: "",
    },
  });

  const type = watch("type");
  const affectCost = watch("affect_cost");

  const typeMeta = STOCK_TYPES[type] ?? {};

  const shouldShowAffectCost = typeMeta.affectCostAllowed ?? false;
  const shouldShowUnitPrice =
    typeMeta.affectCostForced ||
    (typeMeta.affectCostAllowed && affectCost === true);

  const handleChangeType = (value) => {
    setValue("type", value);
    setValue("affect_cost", false);
    setValue("unit_price", null);
  };

  const onSubmit = async (data) => {
    const payload = { ...data };
    if (!shouldShowAffectCost) delete payload.affect_cost;
    if (!shouldShowUnitPrice) delete payload.unit_price;

    try {
      await adjustProductStock(productId, payload);
      toast.success("Điều chỉnh tồn kho thành công");
      onSuccess?.();
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Điều chỉnh thất bại");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Điều chỉnh tồn kho"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <SelectBox
          id="type"
          label="Loại điều chỉnh"
          options={STOCK_TYPE_OPTIONS}
          value={type}
          onChange={handleChangeType}
          error={errors.type?.message}
          required
        />

        <FormGroup
          id="quantity"
          label="Số lượng"
          required
          error={errors.quantity?.message}
        >
          <input
            type="number"
            {...register("quantity")}
            className="form-control"
          />
        </FormGroup>

        {shouldShowAffectCost && (
          <SwitchToggle
            label="Ảnh hưởng đến giá vốn"
            checked={affectCost}
            onChange={(e) => setValue("affect_cost", e.target.checked)}
            className="my-3"
          />
        )}

        {shouldShowUnitPrice && (
          <FormGroup
            id="unit_price"
            label="Đơn giá"
            required={typeMeta.affectCostForced}
            error={errors.unit_price?.message}
          >
            <input
              type="number"
              step="any"
              {...register("unit_price")}
              className="form-control"
            />
          </FormGroup>
        )}

        <FormGroup
          id="note"
          label="Ghi chú"
          error={errors.note?.message}
        >
          <textarea
            {...register("note")}
            className="form-control"
            rows={2}
            placeholder="VD: Kiểm kê phát hiện dư kho, mất hàng, khách trả hàng..."
          />
        </FormGroup>

        <div className="mt-3">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận điều chỉnh"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductAdjustStockModal;
