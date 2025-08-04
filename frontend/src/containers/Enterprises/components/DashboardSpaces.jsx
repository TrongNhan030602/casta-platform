import React from "react";
import { BsPinMapFill } from "react-icons/bs";

const DashboardSpaces = ({ spaces }) => {
  return (
    <div className="dashboard-spaces mb-4">
      <h5 className="dashboard-spaces__title mb-3">Không gian đang sử dụng</h5>
      <div className="dashboard-spaces__list">
        {spaces.map((space, index) => (
          <div
            key={index}
            className="dashboard-spaces__item"
          >
            <div className="dashboard-spaces__header">
              <strong className="dashboard-spaces__name">{space.name}</strong>
              <span className="dashboard-spaces__location">
                {" "}
                - {space.location}
              </span>
            </div>
            <div className="dashboard-spaces__meta">
              <BsPinMapFill className="dashboard-spaces__icon text-secondary me-2" />
              <span className="dashboard-spaces__code">{space.code}</span>
              <span className="dashboard-spaces__separator"> | </span>
              <span className="dashboard-spaces__start">{space.startDate}</span>
              <span className="dashboard-spaces__separator"> | </span>
              <span className="dashboard-spaces__status">{space.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSpaces;
