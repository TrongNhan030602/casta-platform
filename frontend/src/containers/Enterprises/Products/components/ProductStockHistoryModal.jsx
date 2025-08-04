import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import Modal from "@/components/common/Modal";
import CommonFilterBar from "@/components/common/FilterBar";
import DataTable from "@/components/common/DataTable";
import { getProductStockLogs } from "@/services/enterprise/productService";
import { columns } from "./ProductDetail/columns";
import { filterFields } from "./ProductDetail/filterFields";

const ProductStockHistoryModal = ({ open, onClose, productId }) => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: "",
    keyword: "",
    perPage: 15,
  });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword);
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debounce chỉ keyword
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedKeyword(filters.keyword.trim());
      setPage(1);
    }, 400);

    handler();
    return () => handler.cancel();
  }, [filters.keyword]);

  const handleFilterChange = (newValues) => {
    setFilters((prev) => ({ ...prev, ...newValues }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (!productId || !open) return;

    setLoading(true);

    const params = {
      page,
      type: filters.type || undefined,
      keyword: debouncedKeyword || undefined,
      per_page: filters.perPage,
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    getProductStockLogs(Number(productId), params)
      .then((res) => {
        setLogs(res.data?.data || []);
        setMeta(res.data?.meta || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [
    productId,
    filters.type,
    filters.perPage,
    debouncedKeyword,
    page,
    open,
    sortBy,
    sortOrder,
  ]);

  const rowClassName = (log, index) => {
    const prevAvgCost = index > 0 ? logs[index - 1].avg_cost_after : null;
    return prevAvgCost !== null &&
      Number(log.avg_cost_after) !== Number(prevAvgCost)
      ? "bg-warning bg-opacity-10"
      : "";
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="🧾 Lịch sử điều chỉnh tồn kho"
      className="modal-xl"
    >
      <div
        className="p-3 overflow-auto"
        style={{ maxHeight: "70vh" }}
      >
        <CommonFilterBar
          filters={filters}
          fields={filterFields}
          onChange={handleFilterChange}
          showPerPage={true}
        />

        <DataTable
          columns={columns}
          data={logs}
          loading={loading}
          pagination={{
            page,
            totalPages: meta?.last_page,
            onPageChange: handlePageChange,
          }}
          sort={{
            sortBy,
            sortOrder,
            onSortChange: (key, order) => {
              setSortBy(key);
              setSortOrder(order);
              setPage(1);
            },
          }}
          rowClassName={rowClassName}
        />
      </div>
    </Modal>
  );
};

export default ProductStockHistoryModal;
