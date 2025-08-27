//src\containers\Admin\Users\UserList.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHashtag } from "react-icons/fa";

import {
  getUserList,
  checkBeforeDelete,
  deleteUser,
} from "@/services/admin/userService";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import DataTable from "@/components/common/DataTable";
import FilterBar from "@/containers/Admin/Users/components/FilterBar";
import ConfirmModal from "@/components/common/ConfirmModal";
import { exportToExcel } from "@/utils/export";
import { roleLabelMap, roleColorMap, statusMap } from "@/utils/roles";

import "@/assets/styles/layout/admin/users/user-list.css";

const UserList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [lockedCount, setLockedCount] = useState(0);

  const [filters, setFilters] = useState({
    role: "",
    status: "",
    keyword: "",
    perPage: 10,
  });

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteWarning, setDeleteWarning] = useState([]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserList({
        page,
        per_page: filters.perPage,
        role: filters.role || undefined,
        status: filters.status || undefined,
        keyword: filters.keyword || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      setUsers(res.data?.data || []);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || 0);
      // ✅ Đếm số lượng tài khoản bị khóa (status: inactive)
      const locked = (res.data?.data || []).filter(
        (u) => u.status === "inactive"
      ).length;
      setLockedCount(locked);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [page, filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // reset về trang 1 khi lọc
  };

  const handleExport = () => {
    const plainData = users.map((u) => ({
      ID: u.id,
      Tên: u.name,
      Email: u.email,
      VaiTrò: roleLabelMap[u.role] || u.role,
      TrạngThái: statusMap[u.status]?.label || u.status,
    }));
    exportToExcel(plainData, "danh-sach-nguoi-dung");
  };

  const handleSortChange = (columnKey, order) => {
    setSortBy(columnKey);
    setSortOrder(order);
    setPage(1);
  };

  const handleDeleteUser = async (user) => {
    try {
      const res = await checkBeforeDelete(user.id);
      setUserToDelete(user);
      setDeleteWarning(res.data?.warnings || []);
      setShowDeleteModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Không thể kiểm tra thông tin xoá");
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(
        userToDelete.id,
        deleteWarning.length > 0 ? { force: true } : {}
      );
      toast.success("Đã xoá người dùng");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Xoá người dùng thất bại");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
      setDeleteWarning([]);
    }
  };

  const columns = [
    {
      label: "ID",
      key: "id",
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/users/${row.id}`)}
          className="link-button"
          title={`#${row.id} – ${roleLabelMap[row.role]}`}
        >
          <FaHashtag />
          {row.id}
        </button>
      ),
    },
    { label: "Tên đăng nhập", key: "name" },
    { label: "Email", key: "email" },
    {
      label: "Vai trò",
      render: (row) => (
        <Badge
          label={roleLabelMap[row.role] || row.role}
          color={roleColorMap[row.role] || "gray"}
        />
      ),
    },
    {
      label: "Trạng thái",
      render: (row) => (
        <Badge
          label={statusMap[row.status]?.label || row.status}
          color={statusMap[row.status]?.color || "gray"}
        />
      ),
    },
    {
      label: "Hành động",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/users/${row.id}/edit`)}
          >
            Sửa
          </Button>
          <Button
            size="sm"
            variant="danger-outline"
            onClick={() => handleDeleteUser(row)}
          >
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="user-list-page">
      <div className="user-list-header">
        <h2 className="page-title">Quản lý người dùng</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button
            variant={
              filters.status === "inactive" ? "danger" : "danger-outline"
            }
            onClick={() => {
              // Nếu đang active thì bỏ lọc -> reset status
              if (filters.status === "inactive") {
                handleFilterChange({ ...filters, status: "" });
              } else {
                handleFilterChange({ ...filters, status: "inactive" });
              }
            }}
          >
            Tài khoản bị khóa ({lockedCount})
          </Button>

          <Button
            onClick={() => navigate("/admin/users/create")}
            variant="primary"
          >
            + Thêm mới
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
          >
            Xuất Excel
          </Button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
      />

      <p className="total-count">Tổng cộng: {totalItems} người dùng</p>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
        sort={{
          sortBy,
          sortOrder,
          onSortChange: handleSortChange,
        }}
      />

      <ConfirmModal
        open={showDeleteModal}
        title="Xác nhận xoá người dùng"
        message={
          deleteWarning.length > 0 ? (
            <div style={{ lineHeight: 1.6 }}>
              <ul style={{ paddingLeft: 20, color: "#d9534f" }}>
                {deleteWarning.map((warn, index) => (
                  <li key={index}>⚠️ {warn}</li>
                ))}
              </ul>
              <p style={{ marginTop: 12 }}>
                Bạn vẫn muốn <strong>xóa vĩnh viễn</strong> tài khoản này?
              </p>
            </div>
          ) : (
            <p>
              Bạn có chắc chắn muốn <strong>xóa</strong> tài khoản này?
            </p>
          )
        }
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
};

export default UserList;
