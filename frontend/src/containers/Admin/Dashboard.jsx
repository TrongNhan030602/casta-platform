// 📁 src/containers/Admin/Dashboard.jsx
import React from "react";
import {
  FaStore,
  FaUserTie,
  FaUsers,
  FaShoppingBag,
  FaDollarSign,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import "@/assets/styles/layout/admin/admin-dashboard.css";

const AdminDashboard = () => {
  const stats = [
    { icon: <FaStore />, label: "Gian hàng", value: 48 },
    { icon: <FaUserTie />, label: "Doanh nghiệp", value: 22 },
    { icon: <FaUsers />, label: "Khách hàng", value: 1543 },
    { icon: <FaShoppingBag />, label: "Đơn hàng", value: 321 },
    {
      icon: <FaDollarSign />,
      label: "Doanh thu (VNĐ)",
      value: "2.350.000.000",
    },
  ];

  const chartData = [
    { date: "2025-06-18", orders: 15, revenue: 120 },
    { date: "2025-06-19", orders: 28, revenue: 230 },
    { date: "2025-06-20", orders: 35, revenue: 340 },
    { date: "2025-06-21", orders: 45, revenue: 480 },
    { date: "2025-06-22", orders: 31, revenue: 290 },
    { date: "2025-06-23", orders: 55, revenue: 520 },
  ];

  const activities = [
    { date: "2025-06-21", event: "Doanh nghiệp mới đăng ký", count: 3 },
    { date: "2025-06-22", event: "Gian hàng mới tạo", count: 7 },
    { date: "2025-06-23", event: "Đơn hàng thành công", count: 25 },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Tổng quan hiệu suất</h1>

      <section className="dashboard__stats">
        {stats.map(({ icon, label, value }) => (
          <div
            className="dashboard__card"
            key={label}
          >
            <div className="dashboard__card-icon">{icon}</div>
            <div>
              <div className="dashboard__card-label">{label}</div>
              <div className="dashboard__card-value">{value}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard__content">
        <article className="dashboard__chart">
          <h2 className="dashboard__section-title">
            Biểu đồ đơn hàng & doanh thu
          </h2>
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => format(new Date(d), "dd/MM")}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(d) =>
                  `Ngày ${format(new Date(d), "dd/MM/yyyy")}`
                }
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#007289"
                name="Đơn hàng"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#00b4c6"
                name="Doanh thu"
              />
            </LineChart>
          </ResponsiveContainer>
        </article>

        <aside className="dashboard__activity">
          <h2 className="dashboard__section-title">Hoạt động gần đây</h2>
          <ul className="dashboard__activity-list">
            {activities.length > 0 ? (
              activities.map(({ date, event, count }) => (
                <li
                  className="dashboard__activity-item"
                  key={date + event}
                >
                  <span className="dashboard__activity-date">
                    {format(new Date(date), "dd/MM/yyyy")}
                  </span>
                  <span className="dashboard__activity-event">{event}</span>
                  <span className="dashboard__activity-count">{count}</span>
                </li>
              ))
            ) : (
              <li className="dashboard__activity-empty">
                Không có hoạt động nào
              </li>
            )}
          </ul>
        </aside>
      </section>
    </div>
  );
};

export default AdminDashboard;
