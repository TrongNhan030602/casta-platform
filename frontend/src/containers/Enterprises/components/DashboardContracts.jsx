import React from "react";
import { BsFileText } from "react-icons/bs";

const DashboardContracts = ({ contracts }) => {
  return (
    <div className="dashboard-contracts mb-4">
      <h5 className="dashboard-contracts__title mb-3">Hợp đồng gần đây</h5>
      <div className="dashboard-contracts__list">
        {contracts.map((contract, index) => (
          <div
            key={index}
            className="dashboard-contracts__item"
          >
            <BsFileText className="dashboard-contracts__icon text-info me-2" />
            <div className="dashboard-contracts__content">
              <div className="dashboard-contracts__code">{contract.code}</div>
              <div className="dashboard-contracts__meta">
                {contract.status} • {contract.createdAt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContracts;
