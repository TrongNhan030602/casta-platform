import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaExclamationTriangle,
  FaBuilding,
  FaThList,
  FaFileContract,
  FaChevronLeft,
  FaChevronRight,
  FaCommentDots,
  FaTags,
  FaBoxes,
  FaCheckSquare,
} from "react-icons/fa";
import "@/assets/styles/layout/admin/admin-sidebar.css";

const menuItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: <FaTachometerAlt />,
    end: true,
  },
  {
    to: "/admin/users",
    label: "Người dùng",
    icon: <FaUsers />,
  },

  {
    to: "/admin/enterprises",
    label: "Doanh nghiệp",
    icon: <FaBuilding />,
  },
  {
    to: "/admin/exhibition-space-categories",
    label: "Danh mục không gian",
    icon: <FaThList />,
  },
  {
    to: "/admin/product-categories",
    label: "Danh mục sản phẩm",
    icon: <FaThList />,
  },
  {
    to: "/admin/news-categories",
    label: "Danh mục tin tức - sự kiện",
    icon: <FaThList />,
  },
  {
    to: "/admin/services-categories",
    label: "Danh mục dịch vụ",
    icon: <FaThList />,
  },
  {
    to: "/admin/exhibition-spaces",
    label: "Không gian trưng bày",
    icon: <FaBox />,
  },
  {
    to: "/admin/rental-contracts",
    label: "Hợp đồng thuê",
    icon: <FaFileContract />,
  },
  {
    to: "/admin/exhibition-approvals",
    label: "Duyệt sản phẩm trưng bày",
    icon: <FaCheckSquare />,
  },

  {
    to: "/admin/products",
    label: "Sản phẩm",
    icon: <FaBoxes />,
  },

  {
    to: "/admin/violations",
    label: "Cảnh báo",
    icon: <FaExclamationTriangle />,
  },
  {
    to: "/admin/feedbacks",
    label: "Phản hồi",
    icon: <FaCommentDots />,
  },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="admin-sidebar__logo">
        <img
          src="/logo-casta.webp"
          alt="CASTA"
          className="admin-sidebar__logo-img"
          width={collapsed ? 40 : 140}
          height="auto"
        />
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              isActive ? "admin-sidebar__link active" : "admin-sidebar__link"
            }
            title={label}
          >
            {React.cloneElement(icon, { className: "admin-sidebar__icon" })}
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Nút toggle nằm ngoài nav để tránh bị scroll đẩy đi */}
      <div className="admin-sidebar__toggle">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="admin-sidebar__toggle-btn"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
