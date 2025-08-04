import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHashtag } from "react-icons/fa";
import { EXHIBITION_SPACE_STATUSES } from "@/constants/exhibitionStatus";
import {
  getExhibitionSpaces,
  deleteExhibitionSpace,
  updateExhibitionSpaceStatus,
} from "@/services/admin/exhibitionSpaceService";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import CommonFilterBar from "@/components/common/FilterBar";

const ExhibitionSpaceList = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    perPage: 10,
  });
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState(null);

  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getExhibitionSpaces({
        page,
        per_page: filters.perPage,
        keyword: filters.keyword || undefined,
        status: filters.status || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setSpaces(res.data?.data || []);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || 0);
    } catch (err) {
      console.error("Lỗi khi tải không gian:", err);
      toast.error("Không thể tải danh sách không gian");
    } finally {
      setLoading(false);
    }
  }, [page, filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (column, order) => {
    setSortBy(column);
    setSortOrder(order);
    setPage(1);
  };

  const handleDelete = (space) => {
    if (space.status === "in_use") {
      toast.error("Không thể xoá: Không gian đang được sử dụng");
      return;
    }
    setSpaceToDelete(space);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteExhibitionSpace(spaceToDelete.id);
      toast.success("Xoá thành công");
      fetchSpaces();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xoá không gian");
    } finally {
      setShowDeleteModal(false);
      setSpaceToDelete(null);
    }
  };

  const handleStatusChange = async (spaceId, newStatus) => {
    try {
      await updateExhibitionSpaceStatus(spaceId, { status: newStatus });
      toast.success("Cập nhật trạng thái thành công");
      fetchSpaces();
    } catch (err) {
      console.log("🚀 ~ handleStatusChange ~ err:", err);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const columns = [
    {
      label: "ID",
      key: "id",
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/exhibition-spaces/${row.id}`)}
          className="link-button"
        >
          <FaHashtag /> {row.id}
        </button>
      ),
    },
    { label: "Mã", key: "code" },
    { label: "Kích thước", render: (row) => row.size },

    { label: "Vị trí", key: "location" },
    { label: "Khu vực", key: "zone" },
    {
      label: "Trạng thái",
      render: (row) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <select
              className="form-select"
              value={row.status}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
            >
              {Object.keys(EXHIBITION_SPACE_STATUSES).map((key) => (
                <option
                  key={key}
                  value={key}
                >
                  {EXHIBITION_SPACE_STATUSES[key]?.label || key}
                </option>
              ))}
            </select>
          </div>
        );
      },
    },

    {
      label: "Hành động",
      render: (row) => (
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/exhibition-spaces/${row.id}/edit`)}
          >
            Sửa
          </Button>
          <Button
            size="sm"
            variant="danger-outline"
            onClick={() => handleDelete(row)}
          >
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="exhibition-space-list-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Danh sách không gian trưng bày</h2>
        <Button onClick={() => navigate("/admin/exhibition-spaces/create")}>
          + Thêm mới
        </Button>
      </div>

      <CommonFilterBar
        filters={filters}
        onChange={handleFilterChange}
        fields={[
          {
            name: "keyword",
            type: "text",
            placeholder: "Tìm theo mã / vị trí",
          },
          {
            name: "status",
            type: "select",
            options: [
              { value: "", label: "Tất cả trạng thái" },
              ...Object.values(EXHIBITION_SPACE_STATUSES).map((status) => ({
                value: status.value,
                label: status.label,
              })),
            ],
          },
        ]}
      />

      <p className="total-count">Tổng cộng: {totalItems} không gian</p>

      <DataTable
        columns={columns}
        data={spaces}
        loading={loading}
        pagination={{ page, totalPages, onPageChange: setPage }}
        sort={{ sortBy, sortOrder, onSortChange: handleSortChange }}
      />

      <ConfirmModal
        open={showDeleteModal}
        title="Xác nhận xoá không gian"
        message={<p>Bạn có chắc chắn muốn xoá không gian này không?</p>}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ExhibitionSpaceList;
