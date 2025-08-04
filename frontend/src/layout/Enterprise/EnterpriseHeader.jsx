// src/layout/Enterprise/EnterpriseHeader.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import useAuth from "@/hooks/useAuth";
import UserDropdown from "@/components/common/UserDropdown";
import { enterprisePageTitles } from "@/utils/enterprisePageTitles";
import "@/assets/styles/layout/enterprise/enterprise-header.css";

const getTitleFromPath = (pathname) => {
  const matched = Object.keys(enterprisePageTitles)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key));

  return enterprisePageTitles[matched] || "Doanh nghiệp";
};

const EnterpriseHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const title = getTitleFromPath(location.pathname);

  const dropdownItems = [
    {
      label: "Tài khoản của tôi",
      onClick: () => navigate("/enterprise/account"),
    },
    {
      label: "Đăng xuất",
      onClick: () => dispatch(logout()),
      danger: true,
    },
  ];

  return (
    <header className="enterprise-header">
      <div className="enterprise-header__left">
        <h1 className="enterprise-header__title">{title}</h1>
      </div>
      <UserDropdown
        username={user?.name || user?.email || "Doanh nghiệp"}
        items={dropdownItems}
      />
    </header>
  );
};

export default EnterpriseHeader;
