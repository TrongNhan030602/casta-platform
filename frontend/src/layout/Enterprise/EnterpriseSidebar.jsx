// src/layout/Enterprise/EnterpriseSidebar.jsx
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaBuilding,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "@/assets/styles/layout/enterprise/enterprise-sidebar.css";

const menuItems = [
  {
    to: "/enterprise",
    label: "Tổng quan",
    icon: <FaTachometerAlt />,
    end: true,
  },
  {
    to: "/enterprise/profile",
    label: "Hồ sơ của tôi",
    icon: <FaUsers />,
  },
  {
    to: "/enterprise/exhibition-spaces",
    label: "Không gian trưng bày",
    icon: <FaBuilding />,
  },
  {
    to: "/enterprise/products",
    label: "Sản phẩm",
    icon: <FaBoxOpen />,
  },
];

const EnterpriseSidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside
      className={`enterprise-sidebar ${collapsed ? "collapsed" : ""}`}
      aria-label="Sidebar navigation"
    >
      <div className="enterprise-sidebar__logo">
        <img
          src="/logo-casta.webp"
          alt="CASTA"
          className="enterprise-sidebar__logo-img"
          width={collapsed ? 40 : 140}
          height="auto"
        />
      </div>

      <nav className="enterprise-sidebar__nav">
        {menuItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              isActive
                ? "enterprise-sidebar__link active"
                : "enterprise-sidebar__link"
            }
            title={label}
          >
            <span className="enterprise-sidebar__icon">{icon}</span>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="enterprise-sidebar__toggle">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="enterprise-sidebar__toggle-btn"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
    </aside>
  );
};

export default EnterpriseSidebar;
