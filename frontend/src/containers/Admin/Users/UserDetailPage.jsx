import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, fetchLoginLogs } from "@/services/admin/userService";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import UserBasicInfo from "./components/UserBasicInfo";
import EnterpriseInfo from "./components/EnterpriseInfo";
import BelongingEnterpriseInfo from "./components/BelongingEnterpriseInfo";
import CustomerInfo from "./components/CustomerInfo";
import LoginLogList from "./components/LoginLogList";
import ViolationList from "./components/ViolationList";
import UserStatusModal from "@/containers/Admin/Users/components/UserStatusModal";
import AssignRoleModal from "@/containers/Admin/Users/components/AssignRoleModal";
import WarnUserModal from "@/containers/Admin/Users/components/WarnUserModal";
import AdminActions from "./components/AdminActions";
import "@/assets/styles/layout/admin/users/user-detail.css";

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loginLogs, setLoginLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showWarnModal, setShowWarnModal] = useState(false);

  const fetchUser = useCallback(() => {
    setLoading(true);
    getUserById(id)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Lỗi lấy người dùng:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchLogs = useCallback(() => {
    setLogsLoading(true);
    fetchLoginLogs(id)
      .then((res) => setLoginLogs(res.data))
      .catch((err) => console.error("Lỗi lấy login logs:", err))
      .finally(() => setLogsLoading(false));
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user?.id) {
      fetchLogs();
    }
  }, [user, fetchLogs]);

  if (loading) return <LoadingSpinner text="Đang tải người dùng..." />;
  if (!user) return <p>Không tìm thấy người dùng.</p>;

  const { role, enterprise, enterpriseBelongingTo, customer } = user;

  return (
    <div className="user-detail-page">
      <div className="header">
        <h2 className="page-title">Chi tiết người dùng #{user.id}</h2>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </Button>
      </div>

      <div className="content-grid">
        {/* Cột trái: Thông tin chi tiết */}
        <div className="left-column">
          <div className="section">
            <h3>Thông tin tài khoản</h3>
            <UserBasicInfo user={user} />
          </div>

          {role === "dn" && enterprise && (
            <div className="section">
              <h3>Thông tin doanh nghiệp</h3>
              <EnterpriseInfo enterprise={enterprise} />
            </div>
          )}
          {role === "nvdn" && enterpriseBelongingTo && (
            <div className="section">
              <h3>Doanh nghiệp trực thuộc</h3>
              <BelongingEnterpriseInfo company={enterpriseBelongingTo} />
            </div>
          )}
          {role === "kh" && customer && (
            <div className="section">
              <h3>Thông tin khách hàng</h3>
              <CustomerInfo customer={customer} />
            </div>
          )}
          <div className="section">
            <h3>Lịch sử vi phạm</h3>
            <ViolationList violations={user.violations || []} />
          </div>
        </div>

        {/* Cột phải: Thao tác quản trị và danh sách */}
        <div className="right-column">
          <AdminActions
            onChangeStatus={() => setShowStatusModal(true)}
            onAssignRole={() => setShowAssignModal(true)}
            onSendWarning={() => setShowWarnModal(true)}
            isLoading={loading}
          />

          <div className="section">
            <h3>Lịch sử đăng nhập</h3>
            {logsLoading ? (
              <LoadingSpinner text="Đang tải log..." />
            ) : (
              <LoginLogList
                logs={loginLogs}
                onDeleted={(deletedId) =>
                  setLoginLogs((prev) =>
                    prev.filter((log) => log.id !== deletedId)
                  )
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Các modal thao tác */}
      <UserStatusModal
        open={showStatusModal}
        user={user}
        onClose={() => setShowStatusModal(false)}
        onStatusUpdated={fetchUser}
      />
      <AssignRoleModal
        open={showAssignModal}
        user={user}
        onClose={() => setShowAssignModal(false)}
        onRoleAssigned={fetchUser}
      />
      <WarnUserModal
        open={showWarnModal}
        user={user}
        onClose={() => setShowWarnModal(false)}
        onWarned={fetchUser}
      />
    </div>
  );
};

export default UserDetailPage;
