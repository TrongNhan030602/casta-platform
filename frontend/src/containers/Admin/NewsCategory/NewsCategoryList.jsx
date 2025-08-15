import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { flattenCategoryTreeForDropdownMaxLevel2 } from "@/utils/flattenCategoryTree";
import {
  getNewsCategoryList,
  deleteNewsCategory,
  restoreNewsCategory,
  forceDeleteNewsCategory,
  getNewsCategoryTree,
} from "@/services/admin/newsCategoriesService";

import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import CommonFilterBar from "@/components/common/FilterBar";

import NewsCategoryColumns from "./components/NewsCategoryList/NewsCategoryColumns";
import getNewsCategoryFilterFields from "./components/NewsCategoryList/NewsCategoryFilters";
import NewsCategoryConfirmModal from "./components/NewsCategoryList/NewsCategoryConfirmModal";

const NewsCategoryList = () => {
  const navigate = useNavigate();

  // ---------------------------
  // State cơ bản
  // ---------------------------
  const [categories, setCategories] = useState([]);
  const [rootCategories, setRootCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
    sort_by: "id",
    sort_order: "asc",
    perPage: 10,
    parent_id: "",
    status: "",
    deleted: "",
  });

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoryAction, setCategoryAction] = useState({});

  // ---------------------------
  // Debounce keyword
  // ---------------------------
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword.trim().length >= 3 ? keyword.trim() : "");
      setPage(1);
    }, 700);
    return () => clearTimeout(handler);
  }, [keyword]);

  // ---------------------------
  // Load root categories và flatten cache max cấp 2
  // ---------------------------
  useEffect(() => {
    const fetchRootCategories = async () => {
      try {
        const res = await getNewsCategoryTree();
        const flattened = flattenCategoryTreeForDropdownMaxLevel2(
          res.data?.data || []
        ).map((cat) => ({
          id: cat.value,
          name: cat.label,
        }));
        setRootCategories(flattened);
      } catch {
        toast.error("Không thể tải danh mục cha");
      }
    };
    fetchRootCategories();
  }, []);

  const filterFields = useMemo(
    () => getNewsCategoryFilterFields(rootCategories),
    [rootCategories]
  );

  const columns = useMemo(
    () =>
      NewsCategoryColumns(navigate, (category, type) => {
        setCategoryAction({ category, type });
        setShowConfirmModal(true);
      }),
    [navigate]
  );

  // ---------------------------
  // Fetch categories khi page / filters / debouncedKeyword thay đổi
  // ---------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getNewsCategoryList({
          page,
          per_page: Number(filters.perPage) || 10,
          keyword: debouncedKeyword || undefined,
          sort_by: filters.sort_by,
          sort_order: filters.sort_order,
          parent_id: filters.parent_id || undefined,
          status: filters.status || undefined,
          deleted: filters.deleted || undefined,
        });

        setCategories(res.data?.data || []);
        setTotalPages(res.data?.meta?.last_page || 1);
        setTotalItems(res.data?.meta?.total || 0);
      } catch {
        toast.error("Không thể tải danh sách danh mục tin tức");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [page, filters, debouncedKeyword]);

  // ---------------------------
  // Action confirm modal
  // ---------------------------
  const handleConfirmAction = async () => {
    const { category, type } = categoryAction;
    try {
      if (type === "delete") await deleteNewsCategory(category.id);
      else if (type === "force") await forceDeleteNewsCategory(category.id);
      else if (type === "restore") await restoreNewsCategory(category.id);

      toast.success(
        type === "restore" ? "Khôi phục thành công" : "Xoá thành công"
      );
      // fetch lại categories
      const res = await getNewsCategoryList({
        page,
        per_page: Number(filters.perPage) || 10,
        keyword: debouncedKeyword || undefined,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
        parent_id: filters.parent_id || undefined,
        status: filters.status || undefined,
        deleted: filters.deleted || undefined,
      });
      setCategories(res.data?.data || []);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || 0);
    } catch {
      toast.error(type === "restore" ? "Khôi phục thất bại" : "Xoá thất bại");
    } finally {
      setShowConfirmModal(false);
      setCategoryAction({});
    }
  };

  // ---------------------------
  // Filter change
  // ---------------------------
  const handleFilterChange = (newFilters) => {
    const normalized = { ...newFilters };
    ["parent_id", "status", "deleted"].forEach((field) => {
      if (!normalized[field] || normalized[field] === "0")
        normalized[field] = undefined;
      else normalized[field] = String(normalized[field]);
    });
    setFilters((prev) => ({ ...prev, ...normalized }));
    setPage(1);
  };

  return (
    <div className="news-category-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Quản lý danh mục tin tức - sự kiện</h2>
        <Button
          variant="primary"
          onClick={() => navigate("/admin/news-categories/create")}
        >
          + Thêm mới
        </Button>
      </div>

      <CommonFilterBar
        filters={{ ...filters, keyword }}
        fields={filterFields}
        onChange={(updated) => {
          if ("keyword" in updated) setKeyword(updated.keyword);
          const { keyword: _, ...rest } = updated;
          handleFilterChange(rest);
        }}
      />

      <p className="total-count">Tổng cộng: {totalItems} danh mục</p>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        pagination={{ page, totalPages, onPageChange: setPage }}
        sort={{
          sortBy: filters.sort_by,
          sortOrder: filters.sort_order,
          onSortChange: (col, order) =>
            handleFilterChange({ sort_by: col, sort_order: order }),
        }}
      />

      <NewsCategoryConfirmModal
        open={showConfirmModal}
        actionType={categoryAction.type}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default NewsCategoryList;
