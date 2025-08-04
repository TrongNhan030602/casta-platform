import React from "react";
import DashboardStats from "./components/DashboardStats";
import DashboardActions from "./components/DashboardActions";
import DashboardSpaces from "./components/DashboardSpaces";
import DashboardContracts from "./components/DashboardContracts";
import DashboardNotices from "./components/DashboardNotices";
import "@/assets/styles/layout/enterprise/dashboard/dashboard.css";

const EnterpriseDashboard = () => {
  // Dữ liệu thống kê
  const stats = {
    activeSpaces: 3,
    totalContracts: 5,
    approvedProducts: 8,
    alerts: 1,
  };

  // Dữ liệu các hành động thường dùng
  const actions = [
    { label: "Đăng ký không gian", icon: "BsPlusSquare" },
    { label: "Gửi sản phẩm", icon: "BsBoxSeam" },
    { label: "Gia hạn hợp đồng", icon: "BsClockHistory" },
    { label: "Hủy đăng ký", icon: "BsXCircle" },
    { label: "Gửi phản hồi", icon: "BsChatDots" },
  ];

  // Dữ liệu không gian đang sử dụng
  const spaces = [
    {
      code: "S-001",
      name: "Khu A - Sảnh chính",
      location: "Tầng 1",
      startDate: "2025-07-01",
      status: "Đang sử dụng",
    },
    {
      code: "S-005",
      name: "Khu B - Góc trái",
      location: "Tầng 2",
      startDate: "2025-06-20",
      status: "Đang sử dụng",
    },
  ];

  // Dữ liệu hợp đồng
  const contracts = [
    { code: "CT-123", status: "Đã duyệt", createdAt: "2025-07-10" },
    { code: "CT-124", status: "Chờ duyệt", createdAt: "2025-07-15" },
  ];

  // Dữ liệu thông báo hệ thống
  const notices = [
    {
      message: "Hệ thống bảo trì lúc 22:00 ngày 20/07/2025.",
      date: "2025-07-18T10:00:00Z",
    },
    {
      message: "Chính sách xét duyệt sản phẩm mới đã cập nhật.",
      date: "2025-07-17T08:00:00Z",
    },
  ];

  return (
    <div className="dashboard-enterprise container py-4">
      <h2 className="dashboard-enterprise__title mb-4">
        Chào mừng bạn trở lại, Design24
      </h2>

      {/* Thống kê tổng quan */}
      <section className="dashboard-section mb-4">
        <DashboardStats stats={stats} />
      </section>

      {/* Các hành động thường dùng */}
      <section className="dashboard-section mb-4">
        <DashboardActions actions={actions} />
      </section>

      {/* Không gian đang sử dụng */}
      <section className="dashboard-section mb-4">
        <DashboardSpaces spaces={spaces} />
      </section>

      {/* Danh sách hợp đồng */}
      <section className="dashboard-section mb-4">
        <DashboardContracts contracts={contracts} />
      </section>

      {/* Thông báo hệ thống */}
      <section className="dashboard-section mb-4">
        <DashboardNotices notices={notices} />
      </section>
    </div>
  );
};

export default EnterpriseDashboard;
