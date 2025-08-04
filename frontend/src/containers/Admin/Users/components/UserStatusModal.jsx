import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Select from "react-select";
import { toggleUserStatus } from "@/services/admin/userService";
import { toast } from "react-toastify";

const statuses = [
  { value: "pending", label: "🕓 Chờ duyệt" },
  { value: "active", label: "✅ Hoạt động" },
  { value: "inactive", label: "⛔ Tạm khóa" },
  { value: "rejected", label: "❌ Từ chối" },
];

const UserStatusModal = ({ open, onClose, user, onStatusUpdated }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.status) {
      const found = statuses.find((s) => s.value === user.status);
      setSelectedStatus(found || null);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !selectedStatus) return;

    if (selectedStatus.value === user.status) {
      return toast.info("Trạng thái không thay đổi");
    }

    setLoading(true);
    try {
      await toggleUserStatus(user.id, { status: selectedStatus.value });
      toast.success("Cập nhật trạng thái thành công");

      const updatedUser = { ...user, status: selectedStatus.value };
      onStatusUpdated?.(updatedUser);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      title={`Cập nhật trạng thái: ${user?.name || ""}`}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <Select
          options={statuses}
          value={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Chọn trạng thái mới"
          classNamePrefix="react-select"
          menuPortalTarget={document.body} // Đảm bảo dropdown nằm ngoài modal
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPlacement="auto" // Hoặc "top" nếu bạn muốn luôn hiển thị lên trên
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button
            variant="outline"
            onClick={() => onClose(false)}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !selectedStatus}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserStatusModal;
