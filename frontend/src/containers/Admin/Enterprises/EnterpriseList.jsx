import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHashtag } from "react-icons/fa";

import {
  getEnterprises,
  approveEnterprise,
  suspendEnterprise,
  resumeEnterprise,
  rejectEnterprise,
} from "@/services/admin/enterpriseService";

import { enterpriseStatusMap } from "@/utils/enterpriseStatusMap";
import { exportToExcel } from "@/utils/export";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import EnterpriseFilterBar from "@/containers/Admin/Enterprises/components/EnterpriseFilterBar";
import "@/assets/styles/layout/admin/enterprise/enterprise-list.css";

const EnterpriseList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
    status: "",
    search: "",
    perPage: 10,
  });

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedEnterprise, setSelectedEnterprise] = useState(null);

  const fetchEnterprises = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEnterprises({
        page,
        per_page: filters.perPage,
        search: filters.search || undefined,
        status: filters.status || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      const data = res.data?.data || [];
      const lastPage = res.data?.meta?.last_page || 1;

      if (data.length === 0 && page > 1) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        setEnterprises(data);
        setTotalPages(lastPage);
        setTotalItems(res.data?.meta?.total || 0);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách doanh nghiệp:", err);
      toast.error("Không thể tải danh sách doanh nghiệp");
    } finally {
      setLoading(false);
    }
  }, [page, filters, sortBy, sortOrder]);

  useEffect(() => {
    const queryStatus = new URLSearchParams(location.search).get("status");
    if (queryStatus) {
      setFilters((prev) => ({ ...prev, status: queryStatus }));
    }
  }, [location.search]);

  useEffect(() => {
    fetchEnterprises();
  }, [fetchEnterprises]);

  const handleSortChange = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ search: "", status: "", perPage: 10 });
    setPage(1);
  };

  const handleExport = () => {
    const plainData = enterprises.map((e) => ({
      ID: e.id,
      Tên: e.company_name,
      MST: e.tax_code,
      TrạngThái: enterpriseStatusMap[e.status]?.label || e.status,
      Email: e.email,
      ĐạiDiện: e.representative,
      SĐT: e.phone,
    }));
    exportToExcel(plainData, "danh-sach-doanh-nghiep");
  };

  const openConfirm = (action, enterprise) => {
    setConfirmAction(() => action);
    setSelectedEnterprise(enterprise);
    setShowConfirm(true);
  };

  const confirm = async () => {
    if (!selectedEnterprise || !confirmAction) return;
    try {
      await confirmAction(selectedEnterprise.id);
      toast.success("Thao tác thành công");
      fetchEnterprises();
    } catch (err) {
      console.error(err);
      toast.error("Thao tác thất bại");
    } finally {
      setShowConfirm(false);
      setSelectedEnterprise(null);
      setConfirmAction(null);
    }
  };

  const columns = [
    {
      label: "ID",
      key: "id",
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/enterprises/${row.id}`)}
          className="link-button"
        >
          <FaHashtag /> {row.id}
        </button>
      ),
    },
    { label: "Tên DN", key: "company_name" },
    { label: "Mã số thuế", key: "tax_code" },
    { label: "Đại diện", key: "representative" },
    { label: "Email", key: "email" },
    {
      label: "Trạng thái",
      render: (row) => (
        <Badge
          label={enterpriseStatusMap[row.status]?.label || row.status}
          color={enterpriseStatusMap[row.status]?.color || "gray"}
        />
      ),
    },
    {
      label: "Xét duyệt",
      render: (row) => (
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Button
            size="sm"
            variant="secondary"
            title="Xem chi tiết doanh nghiệp"
            onClick={() => navigate(`/admin/enterprises/${row.id}`)}
          >
            Xem
          </Button>

          {row.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="primary"
                onClick={() => openConfirm(approveEnterprise, row)}
              >
                Phê duyệt
              </Button>
              <Button
                size="sm"
                variant="danger-outline"
                onClick={() => openConfirm(rejectEnterprise, row)}
              >
                Từ chối hồ sơ
              </Button>
            </>
          )}

          {row.status === "approved" && (
            <Button
              size="sm"
              variant="danger-outline"
              title="Khóa hồ sơ doanh nghiệp này"
              onClick={() => openConfirm(suspendEnterprise, row)}
            >
              Khóa
            </Button>
          )}

          {row.status === "suspended" && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => openConfirm(resumeEnterprise, row)}
            >
              Kích hoạt lại
            </Button>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = enterprises.filter((e) => e.status === "pending").length;

  return (
    <div className="enterprise-list-page">
      <div className="enterprise-list-header">
        <h2 className="page-title">Quản lý doanh nghiệp</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Button
            variant={filters.status === "pending" ? "danger" : "danger-outline"}
            onClick={() => {
              if (filters.status === "pending") {
                handleFilterChange("status", ""); // reset
              } else {
                handleFilterChange("status", "pending"); // bật lọc
              }
            }}
          >
            Hồ sơ chờ duyệt ({pendingCount})
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
          >
            Xuất Excel
          </Button>
        </div>
      </div>

      <EnterpriseFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <p className="total-count">Tổng cộng: {totalItems} doanh nghiệp</p>

      <DataTable
        columns={columns}
        data={enterprises}
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
        rowClassName={(row) => (row.status === "pending" ? "pending-row" : "")}
      />

      <ConfirmModal
        open={showConfirm}
        title="Xác nhận thao tác"
        message={
          <p>
            Bạn có chắc chắn muốn thực hiện thao tác này với doanh nghiệp{" "}
            <strong>{selectedEnterprise?.company_name}</strong>?
          </p>
        }
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirm}
      />
    </div>
  );
};

export default EnterpriseList;
