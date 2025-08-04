import React from "react";
import Badge from "@/components/common/Badge";
import { formatDateTime } from "@/utils/formatDateTime";
import { RENTAL_CONTRACT_STATUSES } from "@/constants/rentalContractStatus";
import { formatCurrency } from "@/utils/formatCurrency";

const ContractGeneralInfo = ({ contract }) => {
  const statusInfo = RENTAL_CONTRACT_STATUSES[contract.status];

  return (
    <div className="contract-detail__section mb-4">
      <h5 className="contract-detail__section-title">Thông tin chung</h5>
      <p>
        <strong>Mã hợp đồng:</strong> {contract.code}
      </p>
      <p>
        <strong>Trạng thái:</strong>{" "}
        <Badge
          label={statusInfo?.label || contract.status}
          color={statusInfo?.color}
        />
      </p>
      <p>
        <strong>Thời gian:</strong> {formatDateTime(contract.start_date)} →{" "}
        {formatDateTime(contract.end_date)}
      </p>
      <p>
        <strong>Tổng chi phí:</strong> {formatCurrency(contract.total_cost)}
      </p>
      {contract.cancel_reason && (
        <p className="text-danger">
          <strong>Lý do hủy:</strong> {contract.cancel_reason}
        </p>
      )}
      <p>
        <strong>Người duyệt hợp đồng:</strong>{" "}
        {contract.contract_reviewer || "--"}
      </p>
    </div>
  );
};

export default ContractGeneralInfo;
