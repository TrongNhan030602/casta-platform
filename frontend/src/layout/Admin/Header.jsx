import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { pageTitles } from "@/utils/pageTitles";
import { logout } from "@/redux/slices/authSlice";
import UserDropdown from "@/components/common/UserDropdown";
import useAuth from "@/hooks/useAuth";
import "@/assets/styles/layout/admin/admin-header.css";

const getTitleFromPath = (pathname) => {
  const matchedKey = Object.keys(pageTitles)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key));

  return pageTitles[matchedKey] || "Trang quản trị";
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const title = getTitleFromPath(location.pathname);

  const dropdownItems = [
    {
      label: "Thông tin tài khoản",
      onClick: () => navigate("/admin/account"),
    },
    {
      label: "Đổi mật khẩu",
      onClick: () => navigate("/admin/change-password"),
    },
    {
      label: "Đăng xuất",
      onClick: () => dispatch(logout()),
      danger: true,
    },
  ];
  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <h1 className="admin-header__title">{title}</h1>
      </div>
      <UserDropdown
        username={user?.name || user?.email || "Quản trị viên"}
        items={dropdownItems}
      />
    </header>
  );
};

export default Header;
