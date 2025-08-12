import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

import DataTable from "@/components/common/DataTable";
import CommonFilterBar from "@/components/common/FilterBar";
import ApproveModal from "./components/ApproveModal";
import RejectModal from "./components/RejectModal";
import ConfirmModal from "@/components/common/ConfirmModal";

import { getSimpleApprovedEnterprises } from "@/services/admin/enterpriseService";
import {
  getExhibitionSpaceProducts,
  approveExhibitionSpaceProduct,
  deleteExhibitionSpaceProduct,
} from "@/services/admin/exhibitionSpaceProductService";

import { buildFilterFields } from "./components/filters";
import { getColumns } from "./components/columns";
import Button from "@/components/common/Button";

const allowedSorts = ["id", "created_at", "updated_at"];

const ExhibitionApprovalPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [enterprises, setEnterprises] = useState([]);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    enterprise_id: "",
    perPage: 10,
  });

  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");

  // Debounce keyword
  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword);

  const debounceKeyword = useMemo(
    () =>
      debounce((val) => {
        setDebouncedKeyword(val);
      }, 300),
    []
  );

  useEffect(() => {
    debounceKeyword(filters.keyword);
  }, [filters.keyword, debounceKeyword]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getExhibitionSpaceProducts({
        status: filters.status || undefined,
        page,
        per_page: filters.perPage,
        keyword: debouncedKeyword || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        enterprise_id: filters.enterprise_id || undefined,
      });

      setProducts(res.data?.data || []);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || 0);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không thể tải danh sách sản phẩm"
      );
    } finally {
      setLoading(false);
    }
  }, [
    filters.status,
    filters.enterprise_id,
    filters.perPage,
    debouncedKeyword,
    page,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await getExhibitionSpaceProducts({
          status: "pending",
          per_page: 1,
        });
        setPendingCount(res.data?.meta?.total || 0);
      } catch (err) {
        console.log("Không thể lấy số lượng sản phẩm chờ duyệt", err);
      }
    };

    fetchPendingCount();
  }, []);

  useEffect(() => {
    getSimpleApprovedEnterprises()
      .then((res) => setEnterprises(res.data?.data || []))
      .catch(() => toast.error("Không thể tải danh sách doanh nghiệp."));
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (column, order) => {
    if (!allowedSorts.includes(column)) {
      toast.warn("Không thể sắp xếp theo cột này");
      return;
    }
    setSortBy(column);
    setSortOrder(order);
    setPage(1);
  };

  const handleApprove = async () => {
    if (!selectedProduct) return;

    try {
      await approveExhibitionSpaceProduct(selectedProduct.id, {
        status: "approved",
      });
      toast.success("Đã duyệt hiển thị sản phẩm");
      fetchProducts();
    } catch (err) {
      console.log("🚀 ~ handleApprove ~ err:", err);
      toast.error(err.response?.data?.message || "Không thể duyệt sản phẩm");
    } finally {
      setApproveModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleReject = async () => {
    if (!selectedProduct) return;

    if (!rejectionNote.trim()) {
      toast.warning("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      await approveExhibitionSpaceProduct(selectedProduct.id, {
        status: "rejected",
        note: rejectionNote.trim(),
      });
      toast.success("Đã từ chối hiển thị sản phẩm");
      fetchProducts();
    } catch (err) {
      console.log("🚀 ~ handleReject ~ err:", err);
      toast.error(err.response?.data?.message || "Không thể từ chối sản phẩm");
    } finally {
      setRejectModalOpen(false);
      setSelectedProduct(null);
      setRejectionNote("");
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await deleteExhibitionSpaceProduct(selectedProduct.id);
      toast.success("Đã gỡ sản phẩm khỏi không gian");
      fetchProducts();
    } catch (err) {
      console.log("🚀 ~ handleDelete ~ err:", err);

      toast.error(err.response?.data?.message || "Không thể gỡ sản phẩm");
    } finally {
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const columns = useMemo(
    () =>
      getColumns(
        setSelectedProduct,
        () => setRejectModalOpen(true),
        () => setDeleteModalOpen(true),
        () => setApproveModalOpen(true)
      ),
    []
  );

  return (
    <div className="exhibition-approval-page">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="page-title">Sản phẩm trưng bày trong không gian</h2>
        <Button
          variant={showPendingOnly ? "danger" : "danger-outline"}
          size="md"
          onClick={() => {
            const newStatus = !showPendingOnly;
            setShowPendingOnly(newStatus);
            setFilters((prev) => ({
              ...prev,
              status: newStatus ? "pending" : "",
            }));
            setPage(1);
          }}
        >
          Chờ duyệt ({pendingCount})
        </Button>
      </div>

      <CommonFilterBar
        filters={filters}
        onChange={handleFilterChange}
        fields={buildFilterFields(enterprises)}
      />

      <p className="total-count">Tổng cộng: {totalItems} sản phẩm</p>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        pagination={{ page, totalPages, onPageChange: setPage }}
        sort={{ sortBy, sortOrder, onSortChange: handleSortChange }}
      />

      {/* Approve Modal */}
      <ApproveModal
        open={approveModalOpen}
        onClose={() => {
          setApproveModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleApprove}
        product={selectedProduct}
      />

      {/* Reject Modal */}
      <RejectModal
        open={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedProduct(null);
          setRejectionNote("");
        }}
        onConfirm={handleReject}
        product={selectedProduct}
        note={rejectionNote}
        onChangeNote={setRejectionNote}
      />

      <ConfirmModal
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDelete}
        title="Gỡ sản phẩm khỏi không gian"
        message={`Bạn có chắc muốn gỡ sản phẩm "${
          selectedProduct?.product?.name || "Không rõ"
        }" khỏi không gian?`}
      />
    </div>
  );
};

export default ExhibitionApprovalPage;
