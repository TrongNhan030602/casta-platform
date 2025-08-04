import React from "react";
import * as Icons from "react-icons/bs";

const DashboardActions = ({ actions }) => {
  return (
    <div className="dashboard-actions mb-4">
      <h5 className="dashboard-actions__title mb-3">Hành động nhanh</h5>
      <div className="row g-3">
        {actions.map((action, index) => {
          const IconComponent = Icons[action.icon];
          return (
            <div
              key={index}
              className="col-sm-6 col-md-4"
            >
              <div className="dashboard-actions__item d-flex align-items-center gap-2">
                <IconComponent className="dashboard-actions__icon text-primary" />
                <span className="dashboard-actions__label">{action.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardActions;
