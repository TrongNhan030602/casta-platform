import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHashtag } from "react-icons/fa";
import { exportToExcel } from "@/utils/export";

import Button from "@/components/common/Button";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import CommonFilterBar from "@/components/common/FilterBar";
import Badge from "@/components/common/Badge";
import RejectContractModal from "./components/RejectContractModal";
import HandleExtendModal from "./components/HandleExtendModal";

import { RENTAL_CONTRACT_STATUSES } from "@/constants/rentalContractStatus";
import {
  getContracts,
  approveRentalContract,
  rejectRentalContract,
  deleteRentalContract,
  handleContractExtension,
} from "@/services/admin/rentalContractService";
import { formatDateTime } from "@/utils/formatDateTime";

const RentalContractList = () => {
  const navigate = useNavigate();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    start_date: "",
    end_date: "",
    perPage: 10,
    has_extend_request: "",
  });

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const [selectedContract, setSelectedContract] = useState(null);
  const [actionModal, setActionModal] = useState({ type: "", open: false });
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const { keyword, status, start_date, end_date, perPage } = filters;

  const fetchContracts = useCallback(async () => {
    const formatDate = (dateStr) => {
      if (!dateStr) return undefined;
      const d = new Date(dateStr);
      return d.toISOString().slice(0, 10);
    };

    const startDate = formatDate(start_date);
    const endDate = formatDate(end_date);

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
      return;
    }

    setLoading(true);
    try {
      const res = await getContracts({
        page,
        per_page: perPage,
        keyword: keyword || undefined,
        status: status || undefined,
        start_date: startDate,
        end_date: endDate,
        sort_by: sortBy,
        sort_order: sortOrder,
        has_extend_request: filters.has_extend_request || undefined,
      });
      setContracts(res.data?.data || []);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || 0);
    } catch (err) {
      console.error("Lỗi khi tải danh sách hợp đồng:", err);
      toast.error(
        err.response?.data?.message || "Không thể tải danh sách hợp đồng"
      );
    } finally {
      setLoading(false);
    }
  }, [
    page,
    keyword,
    status,
    start_date,
    end_date,
    perPage,
    sortBy,
    sortOrder,
    filters.has_extend_request,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchContracts();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchContracts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (column, order) => {
    setSortBy(column);
    setSortOrder(order);
    setPage(1);
  };
  const [isHandlingExtend, setIsHandlingExtend] = useState(false);

  const handleExtendSubmit = async (payload) => {
    if (!selectedContract) return;

    setIsHandlingExtend(true);
    try {
      await handleContractExtension(selectedContract.id, payload);
      toast.success("Xử lý yêu cầu gia hạn thành công");
      fetchContracts();
      setExtendModalOpen(false);
      setSelectedContract(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xử lý gia hạn");
    } finally {
      setIsHandlingExtend(false);
    }
  };

  const openModal = (type, contract) => {
    setSelectedContract(contract);
    if (type === "reject") {
      setRejectModalOpen(true);
    } else if (type === "handle_extend") {
      setExtendModalOpen(true);
    } else {
      setActionModal({ type, open: true });
    }
  };

  const handleReject = async (reason) => {
    if (!selectedContract) return;
    setLoadingAction(true);
    try {
      await rejectRentalContract(selectedContract.id, {
        reject_reason: reason,
      });
      toast.success("Từ chối hợp đồng thành công");
      fetchContracts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể từ chối hợp đồng");
    } finally {
      setRejectModalOpen(false);
      setSelectedContract(null);
      setLoadingAction(false);
    }
  };

  const handleAction = async () => {
    if (!selectedContract) return;
    try {
      if (actionModal.type === "approve") {
        await approveRentalContract(selectedContract.id);
        toast.success("Duyệt hợp đồng thành công");
      } else if (actionModal.type === "delete") {
        await deleteRentalContract(selectedContract.id);
        toast.success("Xóa hợp đồng thành công");
      }
      fetchContracts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xử lý hợp đồng");
    } finally {
      setActionModal({ type: "", open: false });
      setSelectedContract(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        label: "ID",
        key: "id",
        sortable: true,
        render: (row) => (
          <button
            onClick={() => navigate(`/admin/rental-contracts/${row.id}`)}
            className="link-button"
          >
            <FaHashtag /> {row.id}
          </button>
        ),
      },
      {
        label: "Mã hợp đồng",
        key: "id",
        sortable: true,
        render: (row) => row.code || "--",
      },
      {
        label: "Doanh nghiệp",
        render: (row) => row.enterprise?.name || "--",
      },
      {
        label: "Không gian",
        render: (row) => row.space?.code || "--",
      },
      {
        label: "Ngày bắt đầu",
        key: "start_date",
        sortable: true,
        render: (row) => formatDateTime(row.start_date),
      },
      {
        label: "Ngày kết thúc",
        key: "end_date",
        sortable: true,
        render: (row) => formatDateTime(row.end_date),
      },
      {
        label: "Trạng thái",
        render: (row) => {
          const statusObj = RENTAL_CONTRACT_STATUSES[row.status];
          return statusObj ? (
            <Badge
              label={statusObj.label}
              color={statusObj.color}
            />
          ) : (
            row.status
          );
        },
      },
      {
        label: "Hành động",
        render: (row) => (
          <div className="d-flex gap-2 flex-wrap align-items-center">
            {row.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openModal("approve", row)}
                >
                  Duyệt
                </Button>
                <Button
                  size="sm"
                  variant="danger-outline"
                  onClick={() => openModal("reject", row)}
                >
                  Từ chối
                </Button>
              </>
            )}
            {["pending", "cancelled", "rejected"].includes(row.status) && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => openModal("delete", row)}
              >
                Xóa
              </Button>
            )}
            {row.has_extend_request && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => openModal("handle_extend", row)}
              >
                Xử lý gia hạn
              </Button>
            )}
          </div>
        ),
      },
    ],
    [navigate]
  );
  const handleExportExcel = () => {
    if (!contracts || contracts.length === 0) {
      toast.warning("Không có dữ liệu để xuất.");
      return;
    }

    const dataToExport = contracts.map((item) => ({
      ID: item.id,
      "Mã hợp đồng": item.code,
      "Doanh nghiệp": item.enterprise?.name || "",
      "Không gian": item.space?.code || "",
      "Ngày bắt đầu": formatDateTime(item.start_date),
      "Ngày kết thúc": formatDateTime(item.end_date),
      "Trạng thái":
        RENTAL_CONTRACT_STATUSES[item.status]?.label || item.status || "",
    }));

    exportToExcel(dataToExport, "danh-sach-hop-dong");
  };
  const pendingCount = useMemo(() => {
    return contracts.filter((item) => item.status === "pending").length;
  }, [contracts]);
  const extendRequestCount = useMemo(() => {
    return contracts.filter((item) => item.has_extend_request).length;
  }, [contracts]);

  return (
    <div className="rental-contract-list-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Danh sách hợp đồng thuê</h2>
        <div className="d-flex gap-2">
          <Button
            variant={filters.status === "pending" ? "danger" : "danger-outline"}
            onClick={() =>
              handleFilterChange({
                ...filters,
                status: filters.status === "pending" ? "" : "pending",
              })
            }
            className="d-flex align-items-center gap-2"
          >
            Hợp đồng chờ duyệt
            <span>({pendingCount})</span>
          </Button>
          <Button
            variant={filters.has_extend_request ? "danger" : "danger-outline"}
            onClick={() =>
              handleFilterChange({
                ...filters,
                has_extend_request: filters.has_extend_request ? "" : true,
              })
            }
            className="d-flex align-items-center gap-2"
          >
            Yêu cầu gia hạn
            <span>({extendRequestCount})</span>
          </Button>

          <Button
            onClick={handleExportExcel}
            variant="outline"
          >
            Xuất Excel
          </Button>
        </div>
      </div>

      <CommonFilterBar
        filters={filters}
        onChange={handleFilterChange}
        fields={[
          {
            name: "keyword",
            type: "text",
            placeholder: "Tìm mã / doanh nghiệp",
          },
          {
            name: "status",
            type: "select",
            options: [
              { value: "", label: "Tất cả trạng thái" },
              { value: "pending", label: "Chờ duyệt" },
              { value: "approved", label: "Đã duyệt" },
              { value: "rejected", label: "Từ chối" },
              { value: "cancelled", label: "Đã hủy" },
              { value: "expired", label: "Đã hết hạn" },
            ],
          },
          {
            name: "start_date",
            type: "date",
            placeholder: "Từ ngày",
          },
          {
            name: "end_date",
            type: "date",
            placeholder: "Đến ngày",
          },
        ]}
      />

      <p className="total-count">Tổng cộng: {totalItems} hợp đồng</p>

      <DataTable
        columns={columns}
        data={contracts}
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
        open={actionModal.open}
        title={
          actionModal.type === "approve"
            ? "Xác nhận duyệt hợp đồng"
            : "Xác nhận xóa hợp đồng"
        }
        message={
          <p>
            Bạn có chắc chắn muốn{" "}
            {actionModal.type === "approve" ? "duyệt" : "xóa"} hợp đồng này
            không?
          </p>
        }
        onCancel={() => setActionModal({ type: "", open: false })}
        onConfirm={handleAction}
      />

      <RejectContractModal
        open={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedContract(null);
        }}
        onReject={handleReject}
        loading={loadingAction}
      />
      <HandleExtendModal
        open={extendModalOpen}
        contract={selectedContract}
        onClose={() => {
          setExtendModalOpen(false);
          setSelectedContract(null);
        }}
        onSubmit={handleExtendSubmit} // 👈 Sử dụng đúng hàm xử lý
        loading={isHandlingExtend}
      />
    </div>
  );
};

export default RentalContractList;
