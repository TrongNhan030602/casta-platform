// src/containers/Enterprises/components/DashboardStats.jsx
import React from "react";
import {
  BsHouseDoor,
  BsFileEarmarkText,
  BsCheckCircle,
  BsExclamationTriangle,
} from "react-icons/bs";

const DashboardStats = ({ stats }) => {
  return (
    <div className="dashboard-stats row g-3">
      <div className="col-md-3">
        <div className="dashboard-stats__card">
          <div className="dashboard-stats__icon text-primary">
            <BsHouseDoor />
          </div>
          <div className="dashboard-stats__content">
            <div className="dashboard-stats__number">{stats.activeSpaces}</div>
            <div className="dashboard-stats__label">
              Không gian đang sử dụng
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="dashboard-stats__card">
          <div className="dashboard-stats__icon text-secondary">
            <BsFileEarmarkText />
          </div>
          <div className="dashboard-stats__content">
            <div className="dashboard-stats__number">
              {stats.totalContracts}
            </div>
            <div className="dashboard-stats__label">Tổng hợp đồng</div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="dashboard-stats__card">
          <div className="dashboard-stats__icon text-success">
            <BsCheckCircle />
          </div>
          <div className="dashboard-stats__content">
            <div className="dashboard-stats__number">
              {stats.approvedProducts}
            </div>
            <div className="dashboard-stats__label">Sản phẩm đã duyệt</div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="dashboard-stats__card">
          <div className="dashboard-stats__icon text-warning">
            <BsExclamationTriangle />
          </div>
          <div className="dashboard-stats__content">
            <div className="dashboard-stats__number">{stats.alerts}</div>
            <div className="dashboard-stats__label">Thông báo quan trọng</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
