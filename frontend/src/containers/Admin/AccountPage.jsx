import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { format } from "date-fns";
import useAuth from "@/hooks/useAuth";
import "@/assets/styles/layout/admin/account/account-page.css";

const AccountPage = () => {
  const { user } = useAuth();
  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Ngừng hoạt động";
      case "pending":
        return "Chờ duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return "Không xác định";
    }
  };
  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị hệ thống";
      case "cvcc":
        return "Chuyên viên cấp cao";
      case "cvql":
        return "Chuyên viên quản lý";
      case "qlgh":
        return "Quản lý gian hàng";
      case "dn":
        return "Doanh nghiệp";
      case "nvdn":
        return "Nhân viên doanh nghiệp";
      case "kh":
        return "Khách hàng";
      case "cskh":
        return "Chăm sóc khách hàng";
      case "kt":
        return "Kế toán viên";
      case "qlnd":
        return "Quản lý nội dung";
      case "ktq":
        return "Khách tham quan";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="account-page">
      <h2 className="account-page__title">Thông tin tài khoản</h2>

      <div className="account-page__card">
        <div className="account-page__row">
          <span>ID:</span>
          <strong>{user?.id}</strong>
        </div>
        <div className="account-page__row">
          <span>Tên đăng nhập:</span>
          <strong>{user?.name}</strong>
        </div>
        <div className="account-page__row">
          <span>Email:</span>
          <strong>{user?.email}</strong>
        </div>
        <div className="account-page__row">
          <span>Vai trò:</span>
          <strong className="account-page__role">
            {getRoleLabel(user?.role)}
          </strong>
        </div>
        <div className="account-page__row">
          <span>Trạng thái:</span>
          <strong
            className={`account-page__status account-page__status--${user?.status}`}
          >
            {getStatusLabel(user?.status)}
          </strong>
        </div>
        <div className="account-page__row">
          <span>Email đã xác thực:</span>
          <span>
            {user?.email_verified ? (
              <span className="account-page__verified">
                <FaCheckCircle color="green" /> Đã xác thực
              </span>
            ) : (
              <span className="account-page__not-verified">
                <FaTimesCircle color="red" /> Chưa xác thực
              </span>
            )}
          </span>
        </div>

        <div className="account-page__row">
          <span>Ngày tạo:</span>
          <strong>
            {format(new Date(user?.created_at), "dd/MM/yyyy HH:mm")}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
