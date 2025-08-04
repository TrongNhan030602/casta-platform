import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import SelectBox from "@/components/common/SelectBox";
import Button from "@/components/common/Button";
import { roleLabelMap, systemRoles } from "@/utils/roles";
import { assignUserRole } from "@/services/admin/userService";
import { toast } from "react-toastify";

const AssignRoleModal = ({ user, open, onClose, onRoleAssigned }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Các vai trò không được phép phân quyền
  const restrictedRoles = ["kh", "dn", "nvdn"];

  useEffect(() => {
    if (user?.role) setSelectedRole(user.role);
  }, [user]);

  const handleAssign = async () => {
    if (!selectedRole || selectedRole === user.role) return;

    // Kiểm tra nếu vai trò được chọn nằm trong danh sách bị hạn chế
    if (restrictedRoles.includes(selectedRole)) {
      toast.error(
        "Không thể phân quyền vai trò Khách hàng, Doanh nghiệp hoặc Nhân viên doanh nghiệp."
      );
      return;
    }

    setIsLoading(true);
    try {
      await assignUserRole(user.id, selectedRole);
      toast.success("Phân quyền thành công!");
      onRoleAssigned?.();
      onClose();
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || "Phân quyền thất bại.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý phím Enter
  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !isLoading &&
      selectedRole &&
      selectedRole !== user?.role &&
      !restrictedRoles.includes(selectedRole)
    ) {
      e.preventDefault();
      handleAssign();
    }
  };

  return (
    <Modal
      open={open}
      title="Phân quyền tài khoản"
      onClose={onClose}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={handleKeyDown}
      >
        <p>
          Chọn vai trò mới cho tài khoản: <strong>{user?.name}</strong>
        </p>
        <div className="my-4">
          <SelectBox
            label="Vai trò"
            value={selectedRole}
            onChange={setSelectedRole}
            options={systemRoles
              .filter((role) => !restrictedRoles.includes(role))
              .map((role) => ({
                label: roleLabelMap[role] || role,
                value: role,
              }))}
            disabled={isLoading}
          />
        </div>
        <div
          style={{
            marginTop: 8,
            color: "#666",
            fontSize: "0.9em",
            textAlign: "left",
          }}
        >
          Lưu ý: Không thể phân quyền cho các vai trò Khách hàng, Doanh nghiệp
          hoặc Nhân viên doanh nghiệp. Nhấn <strong>Enter</strong> để xác nhận.
        </div>
        <div className="mt-4 d-flex justify-content-between">
          <div>
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
            >
              Huỷ
            </Button>
          </div>
          <div>
            <Button
              onClick={handleAssign}
              disabled={
                !selectedRole ||
                selectedRole === user?.role ||
                isLoading ||
                restrictedRoles.includes(selectedRole)
              }
            >
              {isLoading ? "Đang lưu..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AssignRoleModal;
