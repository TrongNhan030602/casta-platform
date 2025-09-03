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
  FaFileAlt,
  FaConciergeBell,
} from "react-icons/fa";
import "@/assets/styles/layout/admin/admin-sidebar.css";

// Danh sách menu gốc
const menuItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: <FaTachometerAlt />,
    end: true,
  },
  {
    to: "/admin/users",
    label: "Tài khoản",
    icon: <FaUsers />,
  },
  {
    to: "/admin/enterprises",
    label: "Doanh nghiệp",
    icon: <FaBuilding />,
  },
  {
    to: "/admin/exhibition-space-categories",
    label: "DM không gian",
    icon: <FaThList />,
  },
  {
    to: "/admin/product-categories",
    label: "DM sản phẩm",
    icon: <FaThList />,
  },
  {
    to: "/admin/news-categories",
    label: "DM tin tức - sự kiện",
    icon: <FaThList />,
  },
  {
    to: "/admin/services-categories",
    label: "DM dịch vụ",
    icon: <FaThList />,
  },
  {
    to: "/admin/exhibition-spaces",
    label: "Không gian",
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
    to: "/admin/posts",
    label: "Tin tức & Sự kiện",
    icon: <FaFileAlt />,
  },
  {
    to: "/admin/services",
    label: "Dịch vụ",
    icon: <FaConciergeBell />,
  },
  {
    to: "/admin/tags",
    label: "Tag",
    icon: <FaTags />,
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

// Nhóm menu để gom gọn hiển thị
const menuGroups = [
  {
    title: "Quản lý chính",
    keys: ["/admin", "/admin/users", "/admin/enterprises"],
  },
  {
    title: "Danh mục",
    keys: [
      "/admin/exhibition-space-categories",
      "/admin/product-categories",
      "/admin/news-categories",
      "/admin/services-categories",
    ],
  },
  {
    title: "Nội dung",
    keys: [
      "/admin/exhibition-spaces",
      "/admin/products",
      "/admin/posts",
      "/admin/services",
      "/admin/tags",
    ],
  },
  {
    title: "Phê duyệt",
    keys: ["/admin/rental-contracts", "/admin/exhibition-approvals"],
  },
  {
    title: "Khác",
    keys: ["/admin/violations", "/admin/feedbacks"],
  },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo */}
      <div className="admin-sidebar__logo">
        <img
          src="/logo-casta.webp"
          alt="CASTA"
          className="admin-sidebar__logo-img"
          width={collapsed ? 40 : 140}
          height="auto"
        />
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar__nav">
        {menuGroups.map((group) => (
          <div
            key={group.title}
            className="admin-sidebar__group"
          >
            {!collapsed && (
              <div className="admin-sidebar__group-title">{group.title}</div>
            )}
            {menuItems
              .filter((item) => group.keys.includes(item.to))
              .map(({ to, label, icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    isActive
                      ? "admin-sidebar__link active"
                      : "admin-sidebar__link"
                  }
                  title={label}
                >
                  {React.cloneElement(icon, {
                    className: "admin-sidebar__icon",
                  })}
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              ))}
          </div>
        ))}
      </nav>

      {/* Toggle */}
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
