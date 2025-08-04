import React, { useEffect, useState, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHashtag } from "react-icons/fa";

import {
  getCategoryList,
  deleteCategory,
} from "@/services/admin/productCategoryService";

import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import CommonFilterBar from "@/components/common/FilterBar";

const ProductCategoryList = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
    sort_by: "id",
    sort_order: "asc",
    per_page: 10,
    parent_id: "",
    is_active: "",
    description: "",
  });

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // ✅ debounce keyword input
  const debouncedSetKeyword = useMemo(
    () => debounce((value) => setDebouncedKeyword(value), 400),
    []
  );

  useEffect(() => {
    debouncedSetKeyword(keyword);
    return () => debouncedSetKeyword.cancel();
  }, [keyword, debouncedSetKeyword]);

  // ✅ fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategoryList({
        page,
        per_page: Number(filters.per_page) || 10,
        keyword: debouncedKeyword || undefined,
        sort_by: filters.sort_by || undefined,
        sort_order: filters.sort_order || undefined,
        parent_id: filters.parent_id || undefined,
        is_active: filters.is_active || undefined,
        description: filters.description || undefined,
      });

      const data = res.data?.data || [];
      setCategories(data);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || 0);
    } catch (err) {
      console.error("Lỗi khi tải danh mục sản phẩm:", err);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, [page, filters, debouncedKeyword]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(categoryToDelete.id);
      toast.success("Xoá danh mục thành công");
      fetchCategories();
    } catch (err) {
      console.error("Xoá danh mục thất bại:", err);
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

    setFilters((prev) => {
      const changed = Object.entries(others).some(
        ([key, value]) => prev[key] !== value
      );
      return changed ? { ...prev, ...others } : prev;
    });

    setPage(1);
  };

  const rootCategories = useMemo(() => {
    return categories.filter((cat) => !cat.parent);
  }, [categories]);

  const filterFields = [
    {
      name: "keyword",
      type: "text",
      placeholder: "Tìm theo tên / mô tả",
    },

    {
      name: "parent_id",
      type: "select",
      placeholder: "Lọc theo danh mục cha",
      options: [
        { label: "Danh mục cha: Tất cả", value: "" },
        ...rootCategories.map((cat) => ({
          label: cat.name,
          value: cat.id,
        })),
      ],
    },
    {
      name: "is_active",
      type: "select",
      placeholder: "Trạng thái hoạt động",
      options: [
        { label: "Trạng thái: Tất cả", value: "" },
        { label: "Đang hoạt động", value: "1" },
        { label: "Chưa hoạt động", value: "0" },
      ],
    },
  ];

  const columns = [
    {
      label: "ID",
      key: "id",
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/product-categories/${row.id}/edit`)}
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
      render: (row) => <span>{row.description || "—"}</span>,
    },
    {
      label: "Trạng thái",
      render: (row) => (
        <span
          className={`badge badge--${row.is_active ? "success" : "secondary"}`}
        >
          {row.is_active ? "Đang hoạt động" : "Chưa hoạt động"}
        </span>
      ),
    },
    {
      label: "Danh mục cha",
      render: (row) =>
        row.parent ? <span>{row.parent.name}</span> : <span>—</span>,
    },
    {
      label: "Hành động",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/product-categories/${row.id}/edit`)}
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
    <div className="product-category-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Quản lý danh mục sản phẩm</h2>
        <Button
          variant="primary"
          onClick={() => navigate("/admin/product-categories/create")}
        >
          + Thêm mới
        </Button>
      </div>

      <CommonFilterBar
        filters={{ ...filters, keyword }}
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
          sortBy: filters.sort_by,
          sortOrder: filters.sort_order,
          onSortChange: (columnKey, order) => {
            setPage(1);
            handleFilterChange({
              sort_by: columnKey,
              sort_order: order,
            });
          },
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

export default ProductCategoryList;
