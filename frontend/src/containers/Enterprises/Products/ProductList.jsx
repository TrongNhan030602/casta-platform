import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

import {
  getEnterpriseProductList,
  deleteEnterpriseProduct,
  restoreEnterpriseProduct,
  getProductCategoryTree,
  submitEnterpriseProduct,
} from "@/services/enterprise/productService";
import { flattenCategoryTreeForDropdown } from "@/utils/flattenCategoryTree";
import { exportToExcel } from "@/utils/export";
import { mapProductExportData } from "./components/ProductList/productExportHelper";
import { getFilterFields } from "./components/ProductList/filterFields";
import { getColumns } from "./components/ProductList/columns";

import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import CommonFilterBar from "@/components/common/FilterBar";

const defaultFilters = {
  keyword: "",
  status: "",
  category_id: "",
  price_min: "",
  price_max: "",
  perPage: 10,
};

const EnterpriseProductList = () => {
  const navigate = useNavigate();
  const filtersRef = useRef(defaultFilters);

  const [products, setProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [rawFilters, setRawFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [modals, setModals] = useState({ delete: false, restore: false });
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isForceDelete, setIsForceDelete] = useState(false);

  const updateModals = (type, open, product = null, force = false) => {
    setModals((prev) => ({ ...prev, [type]: open }));
    setCurrentProduct(product);
    if (type === "delete") setIsForceDelete(force);
  };

  const debounceUpdateFilters = useMemo(
    () =>
      debounce((next) => {
        filtersRef.current = next;
        setFilters(next);
        setPage(1);
      }, 300),
    []
  );

  useEffect(
    () => () => debounceUpdateFilters.cancel(),
    [debounceUpdateFilters]
  );

  const handleFilterChange = (next) => {
    setRawFilters(next);
    debounceUpdateFilters(next);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEnterpriseProductList({
        page,
        per_page: filters.perPage,
        ...filters,
        keyword: filters.keyword || undefined,
        deleted: filters.deleted || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setProducts(res.data?.data || []);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || 0);
    } catch {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getProductCategoryTree();
        setCategoryOptions(flattenCategoryTreeForDropdown(res.data?.data));
      } catch {
        toast.error("Không thể tải danh mục sản phẩm");
      }
    };
    fetchCategories();
  }, []);

  const confirmDelete = async () => {
    try {
      await deleteEnterpriseProduct(currentProduct.id, {
        force: isForceDelete,
      });
      toast.success(isForceDelete ? "Đã xoá vĩnh viễn" : "Đã xoá sản phẩm");
      fetchProducts();
    } catch {
      toast.error("Không thể xoá sản phẩm");
    } finally {
      updateModals("delete", false);
    }
  };

  const confirmRestore = async () => {
    try {
      await restoreEnterpriseProduct(currentProduct.id);
      toast.success("Khôi phục sản phẩm thành công");
      fetchProducts();
    } catch {
      toast.error("Không thể khôi phục sản phẩm");
    } finally {
      updateModals("restore", false);
    }
  };
  const handleSubmitProduct = async (product = null, isReloadOnly = false) => {
    try {
      if (product) {
        await submitEnterpriseProduct(product.id);
        if (!isReloadOnly) {
          toast.success("Sản phẩm đã được gửi duyệt.");
        }
      }
      fetchProducts();
    } catch {
      toast.error("Không thể gửi duyệt sản phẩm.");
    }
  };

  return (
    <div className="product-list-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Sản phẩm của bạn</h2>
        <div className="d-flex gap-3">
          <Button onClick={() => navigate("/enterprise/products/create")}>
            + Thêm mới
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              exportToExcel(
                mapProductExportData(products),
                "danh_sach_san_pham"
              )
            }
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xuất Excel"}
          </Button>
        </div>
      </div>

      <CommonFilterBar
        filters={rawFilters}
        onChange={handleFilterChange}
        fields={getFilterFields(categoryOptions)}
      />
      <p className="total-count">Tổng cộng: {totalItems} sản phẩm</p>

      <DataTable
        columns={getColumns(navigate, updateModals, handleSubmitProduct)}
        data={products}
        loading={loading}
        pagination={{ page, totalPages, onPageChange: setPage }}
        sort={{
          sortBy,
          sortOrder,
          onSortChange: (col, order) => {
            setSortBy(col);
            setSortOrder(order);
            setPage(1);
          },
        }}
      />

      <ConfirmModal
        open={modals.delete}
        title={
          isForceDelete ? "Xác nhận xoá vĩnh viễn" : "Xác nhận xoá sản phẩm"
        }
        message={
          <p>
            {isForceDelete
              ? "Bạn có chắc chắn muốn xoá vĩnh viễn sản phẩm này không?"
              : "Bạn có chắc chắn muốn xoá (mềm) sản phẩm này không?"}
          </p>
        }
        onCancel={() => updateModals("delete", false)}
        onConfirm={confirmDelete}
      />

      <ConfirmModal
        open={modals.restore}
        title="Xác nhận khôi phục sản phẩm"
        message={<p>Bạn có chắc chắn muốn khôi phục sản phẩm này không?</p>}
        onCancel={() => updateModals("restore", false)}
        onConfirm={confirmRestore}
      />
    </div>
  );
};

export default EnterpriseProductList;
