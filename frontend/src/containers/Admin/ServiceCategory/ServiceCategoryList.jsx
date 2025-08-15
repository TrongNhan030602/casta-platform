import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { flattenCategoryTreeForDropdownMaxLevel2 } from "@/utils/flattenCategoryTree";
import {
  getServiceCategoryList,
  deleteServiceCategory,
  restoreServiceCategory,
  forceDeleteServiceCategory,
  getServiceCategoryTree,
} from "@/services/admin/serviceCategoriesService";

import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import CommonFilterBar from "@/components/common/FilterBar";

import ServiceCategoryColumns from "./components/ServiceCategoryList/ServiceCategoryColumns";
import getServiceCategoryFilterFields from "./components/ServiceCategoryList/getServiceCategoryFilterFields";
import ServiceCategoryConfirmModal from "./components/ServiceCategoryList/ServiceCategoryConfirmModal";

const ServiceCategoryList = () => {
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
  // Load root categories
  // ---------------------------
  useEffect(() => {
    const fetchRootCategories = async () => {
      try {
        const res = await getServiceCategoryTree();
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
    () => getServiceCategoryFilterFields(rootCategories),
    [rootCategories]
  );

  const columns = useMemo(
    () =>
      ServiceCategoryColumns(navigate, (category, type) => {
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
        const res = await getServiceCategoryList({
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
        toast.error("Không thể tải danh sách danh mục dịch vụ");
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
      if (type === "delete") await deleteServiceCategory(category.id);
      else if (type === "force") await forceDeleteServiceCategory(category.id);
      else if (type === "restore") await restoreServiceCategory(category.id);

      toast.success(
        type === "restore" ? "Khôi phục thành công" : "Xoá thành công"
      );

      // fetch lại categories
      const res = await getServiceCategoryList({
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
    } catch (err) {
      if (err.response?.status === 409) {
        // Nếu BE trả về 409, nghĩa là có danh mục con
        toast.error(
          "Danh mục này có danh mục con. Bạn cần xóa con hoặc di chuyển chúng trước khi xóa danh mục cha.",
          { autoClose: 10000 }
        );
      } else {
        toast.error(type === "restore" ? "Khôi phục thất bại" : "Xoá thất bại");
      }
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
    <div className="service-category-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Quản lý danh mục dịch vụ</h2>
        <Button
          variant="primary"
          onClick={() => navigate("/admin/services-categories/create")}
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

      <ServiceCategoryConfirmModal
        open={showConfirmModal}
        actionType={categoryAction.type}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default ServiceCategoryList;
