import { useEffect, useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getServiceList,
  deleteService,
  restoreService,
  forceDeleteService,
} from "@/services/admin/servicesService";
import { getServiceCategoryTree } from "@/services/admin/serviceCategoriesService";
import { flattenCategoryTreeForDropdown } from "@/utils/flattenCategoryTree";

import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import CommonFilterBar from "@/components/common/FilterBar";

import ServiceColumns from "./components/ServiceList/ServiceColumns";
import getServiceFilterFields from "./components/ServiceList/ServiceFilters";
import ServiceConfirmModal from "./components/ServiceList/ServiceConfirmModal";

const ServiceList = () => {
  const navigate = useNavigate();

  // ---------------------------
  // State
  // ---------------------------
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    sort_by: "id",
    sort_order: "desc",
    perPage: 10,
    status: "",
    deleted: "",
    category_id: "",
  });

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [serviceAction, setServiceAction] = useState({});

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
  // Fetch categories
  // ---------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getServiceCategoryTree();
        const flattened = flattenCategoryTreeForDropdown(res.data?.data || []);
        setCategories(flattened);
      } catch (err) {
        console.error("🚀 ~ fetchCategories ~ err:", err);
        toast.error("Không thể tải danh mục dịch vụ");
      }
    };
    fetchCategories();
  }, []);

  // ---------------------------
  // Fetch services
  // ---------------------------
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getServiceList({
        page,
        per_page: Number(filters.perPage) || 10,
        keyword: debouncedKeyword || undefined,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
        status: filters.status || undefined,
        deleted: filters.deleted || undefined,
        category_id: filters.category_id || "",
      });

      setServices(res.data?.data || []);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || 0);
    } catch {
      toast.error("Không thể tải danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  }, [page, filters, debouncedKeyword]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // ---------------------------
  // Confirm action
  // ---------------------------
  const handleConfirmAction = async () => {
    const { service, type } = serviceAction;
    try {
      if (type === "delete") await deleteService(service.id);
      else if (type === "force") await forceDeleteService(service.id);
      else if (type === "restore") await restoreService(service.id);

      toast.success(
        type === "restore" ? "Khôi phục thành công" : "Xoá thành công"
      );
      await fetchServices();
    } catch {
      toast.error(type === "restore" ? "Khôi phục thất bại" : "Xoá thất bại");
    } finally {
      setShowConfirmModal(false);
      setServiceAction({});
    }
  };

  // ---------------------------
  // Filter change
  // ---------------------------
  const handleFilterChange = (newFilters) => {
    const normalized = { ...newFilters };
    ["status", "deleted"].forEach((field) => {
      if (!normalized[field] || normalized[field] === "0")
        normalized[field] = undefined;
      else normalized[field] = String(normalized[field]);
    });
    setFilters((prev) => ({ ...prev, ...normalized }));
    setPage(1);
  };

  const filterFields = useMemo(
    () => getServiceFilterFields(categories),
    [categories]
  );

  const columns = useMemo(
    () =>
      ServiceColumns(navigate, (service, type) => {
        setServiceAction({ service, type });
        setShowConfirmModal(true);
      }),
    [navigate]
  );

  return (
    <div className="service-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Quản lý dịch vụ</h2>
        <Button
          variant="primary"
          onClick={() => navigate("/admin/services/create")}
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

      <p className="total-count">Tổng cộng: {totalItems} dịch vụ</p>

      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        pagination={{ page, totalPages, onPageChange: setPage }}
        sort={{
          sortBy: filters.sort_by,
          sortOrder: filters.sort_order,
          onSortChange: (col, order) =>
            handleFilterChange({ sort_by: col, sort_order: order }),
        }}
      />

      <ServiceConfirmModal
        open={showConfirmModal}
        actionType={serviceAction.type}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default ServiceList;
