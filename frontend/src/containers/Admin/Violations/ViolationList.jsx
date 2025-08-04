import React, { useState, useEffect, useCallback } from "react";
import {
  getViolationList,
  deleteViolation,
} from "@/services/admin/violationService";

import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import FilterBar from "@/containers/Admin/Violations/components/FilterBarViolation";
import { exportToExcel } from "@/utils/export";
import { toast } from "react-toastify";
import { formatDateTime } from "@/utils/formatDateTime";
const ViolationListPage = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedViolation, setSelectedViolation] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState([]);

  const [filters, setFilters] = useState({
    keyword: "",
    perPage: 15,
  });

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const fetchViolations = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        per_page: filters.perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      const res = await getViolationList(params);
      setViolations(res.data.data || []);
      setMeta(res.data.meta || {});
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Không thể tải danh sách cảnh báo";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortBy, sortOrder]);

  useEffect(() => {
    fetchViolations();
  }, [fetchViolations]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // reset trang khi filter
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSortChange = (columnKey, order) => {
    setSortBy(columnKey);
    setSortOrder(order);
    setPage(1); // reset trang khi sort
  };

  const handleOpenDeleteModal = (violation) => {
    setSelectedViolation(violation);
    setDeleteWarning([]);
    setShowDeleteModal(true);
  };
  const handleExport = () => {
    const plainData = violations.map((v) => ({
      ID: v.id,
      "Tên người dùng": v.user?.name || "",
      Email: v.user?.email || "",
      "Lý do": v.reason,
      "Chi tiết": v.details || "",
      "Thời gian": formatDateTime(v.created_at),
    }));

    exportToExcel(plainData, "canh-bao-vi-pham");
  };

  const handleDelete = async () => {
    if (!selectedViolation) return;

    try {
      await deleteViolation(selectedViolation.id);
      toast.success("Đã xoá cảnh báo");
      fetchViolations();
    } catch (err) {
      const msg = err?.response?.data?.message || "Xoá cảnh báo thất bại";
      toast.error(msg);
    } finally {
      setShowDeleteModal(false);
      setSelectedViolation(null);
      setDeleteWarning([]);
    }
  };

  const columns = [
    { label: "ID", key: "id" },
    {
      label: "Người dùng",
      render: (row) => `${row.user.name} (#${row.user.id})`,
    },
    {
      label: "Email",
      render: (row) => row.user.email,
    },
    { label: "Lý do", key: "reason" },
    {
      label: "Chi tiết",
      render: (row) => row.details || "(Không có)",
    },
    {
      label: "Thời gian",
      key: "created_at",
      render: (row) => formatDateTime(row.created_at),
    },
    {
      label: "Hành động",
      render: (row) => (
        <Button
          size="sm"
          variant="danger-outline"
          onClick={() => handleOpenDeleteModal(row)}
        >
          Xoá
        </Button>
      ),
    },
  ];

  return (
    <div className="violation-list-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 className="page-title">Danh sách cảnh báo vi phạm</h2>
        <Button
          variant="outline"
          onClick={handleExport}
        >
          Xuất Excel
        </Button>
      </div>

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
      />

      <p className="total-count">
        Tổng cộng: <strong>{meta.total}</strong> cảnh báo vi phạm
      </p>

      <DataTable
        columns={columns}
        data={violations}
        loading={loading}
        pagination={{
          page: meta.current_page,
          totalPages: meta.last_page,
          onPageChange: handlePageChange,
        }}
        sort={{
          sortBy,
          sortOrder,
          onSortChange: handleSortChange,
        }}
      />

      <ConfirmModal
        open={showDeleteModal}
        title="Xác nhận xoá cảnh báo"
        message={
          deleteWarning.length > 0 ? (
            <div style={{ lineHeight: 1.6 }}>
              <ul style={{ paddingLeft: 20, color: "#d9534f" }}>
                {deleteWarning.map((warn, index) => (
                  <li key={index}>⚠️ {warn}</li>
                ))}
              </ul>
              <p style={{ marginTop: 12 }}>
                Bạn vẫn muốn <strong>xóa vĩnh viễn</strong> cảnh báo này?
              </p>
            </div>
          ) : (
            <p>
              Bạn có chắc chắn muốn <strong>xóa</strong> cảnh báo này?
            </p>
          )
        }
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedViolation(null);
          setDeleteWarning([]);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ViolationListPage;
