import React from "react";
import { BsBell } from "react-icons/bs";

const DashboardNotices = ({ notices }) => {
  return (
    <div className="dashboard-notices mb-4">
      <h5 className="dashboard-notices__title mb-3">Thông báo hệ thống</h5>
      <div className="dashboard-notices__list">
        {notices.map((notice, index) => (
          <div
            key={index}
            className="dashboard-notices__item"
          >
            <BsBell className="dashboard-notices__icon text-warning me-2" />
            <div className="dashboard-notices__content">
              <div className="dashboard-notices__message">{notice.message}</div>
              <div className="dashboard-notices__date">
                {new Date(notice.date).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardNotices;
