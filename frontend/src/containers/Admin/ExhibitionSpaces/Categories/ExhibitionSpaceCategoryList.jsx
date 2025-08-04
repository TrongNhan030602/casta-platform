import React, { useEffect, useState, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHashtag } from "react-icons/fa";

import {
  getExhibitionSpaceCategories,
  deleteExhibitionSpaceCategory,
} from "@/services/admin/exhibitionSpaceService";

import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import CommonFilterBar from "@/components/common/FilterBar";

const ExhibitionSpaceCategoryList = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [immediateFilters, setImmediateFilters] = useState({
    sort_by: "id",
    sort_order: "asc",
    perPage: 10,
  });

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const debounceRef = useRef(
    debounce((value) => {
      setDebouncedKeyword(value);
    }, 400)
  );

  useEffect(() => {
    const debouncedFn = debounceRef.current;
    return () => {
      debouncedFn.cancel();
    };
  }, []);

  useEffect(() => {
    debounceRef.current(keyword);
  }, [keyword]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getExhibitionSpaceCategories({
        page,
        per_page: immediateFilters.perPage,
        keyword: debouncedKeyword || undefined,
        sort_by: immediateFilters.sort_by || undefined,
        sort_order: immediateFilters.sort_order || undefined,
      });

      const data = res.data?.data || [];
      setCategories(data);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || 0);
    } catch (err) {
      console.error("Lỗi khi lấy danh mục:", err);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, [page, immediateFilters, debouncedKeyword]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteExhibitionSpaceCategory(categoryToDelete.id);
      toast.success("Xoá danh mục thành công");
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi xoá danh mục:", err);
      toast.error("Xoá danh mục thất bại");
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleFilterChange = (newFilters) => {
    if ("keyword" in newFilters) {
      setKeyword(newFilters.keyword);
    }

    const { keyword: _, ...others } = newFilters;
    setImmediateFilters((prev) => ({
      ...prev,
      ...others,
    }));

    setPage(1);
  };

  const filterFields = [
    {
      name: "keyword",
      type: "text",
      placeholder: "Tìm theo tên / mô tả",
    },
  ];

  const idNameMap = Object.fromEntries(
    categories.map((cat) => [cat.id, cat.name])
  );

  const columns = [
    {
      label: "ID",
      key: "id",
      render: (row) => (
        <button
          onClick={() =>
            navigate(`/admin/exhibition-space-categories/${row.id}/edit`)
          }
          className="link-button"
          title={`#${row.id}`}
        >
          <FaHashtag />
          {row.id}
        </button>
      ),
    },
    { label: "Tên danh mục", key: "name" },
    {
      label: "Mô tả",
      key: "description",
      render: (row) => <span>{row.description || "—"}</span>,
    },
    {
      label: "Danh mục cha",
      render: (row) =>
        row.parent_id ? (
          <span>{idNameMap[row.parent_id] || `#${row.parent_id}`}</span>
        ) : (
          <span>—</span>
        ),
    },
    {
      label: "Hành động",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(`/admin/exhibition-space-categories/${row.id}/edit`)
            }
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
    <div className="exhibition-space-category-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Quản lý danh mục không gian trưng bày</h2>
        <Button
          variant="primary"
          onClick={() => navigate("/admin/exhibition-space-categories/create")}
        >
          + Thêm mới
        </Button>
      </div>

      <CommonFilterBar
        filters={{ ...immediateFilters, keyword }}
        fields={filterFields}
        onChange={handleFilterChange}
      />

      <p className="total-count">Tổng cộng: {totalItems} danh mục</p>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
        sort={{
          sortBy: immediateFilters.sort_by,
          sortOrder: immediateFilters.sort_order,
          onSortChange: (columnKey, order) =>
            handleFilterChange({
              ...immediateFilters,
              sort_by: columnKey,
              sort_order: order,
              keyword,
            }),
        }}
      />

      <ConfirmModal
        open={showDeleteModal}
        title="Xác nhận xoá danh mục"
        message={
          <p>
            Bạn có chắc chắn muốn <strong>xóa</strong> danh mục này không?
          </p>
        }
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ExhibitionSpaceCategoryList;
