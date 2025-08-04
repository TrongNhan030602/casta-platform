import React, { useState } from "react";
import { getEnterpriseStatusOptions } from "@/utils/productStatusUtils";
import { updateEnterpriseProductStatus } from "@/services/enterprise/productService";
import { toast } from "react-toastify";

const StatusSelectInline = ({ product, onSuccess }) => {
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === product.status) return;

    setUpdating(true);
    try {
      await updateEnterpriseProductStatus(product.id, { status: newStatus });
      toast.success("Cập nhật trạng thái thành công");
      onSuccess?.(); // chỉ gọi nếu thành công
    } catch (error) {
      console.log("🚀 ~ handleChange ~ error:", error);
      toast.error("Cập nhật trạng thái thất bại");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      className="form-select form-select-sm"
      value={product.status}
      onChange={handleChange}
      disabled={updating}
      style={{ minWidth: 128 }}
    >
      {getEnterpriseStatusOptions(product.status).map(({ value, label }) => (
        <option
          key={value}
          value={value}
        >
          {label}
        </option>
      ))}
    </select>
  );
};

export default StatusSelectInline;
