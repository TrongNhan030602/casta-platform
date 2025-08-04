import React from "react";
import { EXHIBITION_SPACE_STATUSES } from "@/constants/exhibitionStatus";
import SelectBox from "@/components/common/SelectBox";

const AdminActions = ({ onStatusChange, isLoading }) => {
  const handleStatusChange = (newStatus) => {
    onStatusChange(newStatus);
  };

  const statusOptions = Object.values(EXHIBITION_SPACE_STATUSES).map(
    (status) => ({
      value: status.value,
      label: status.label,
    })
  );

  return (
    <div className="section">
      <h3 className="section-title">Thao tác quản trị</h3>
      <div className="exhibition-space-detail__form-group">
        <SelectBox
          id="status"
          label="Trạng thái"
          options={statusOptions}
          onChange={handleStatusChange}
          isLoading={isLoading}
          placeholder="Chọn trạng thái"
        />
      </div>
    </div>
  );
};

export default AdminActions;
