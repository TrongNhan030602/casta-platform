import { useReducer, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

import {
  getProductList,
  deleteProduct,
  updateProductStatus,
  adminRestoreProduct,
} from "@/services/admin/productService";
import { getSimpleApprovedEnterprises } from "@/services/admin/enterpriseService";

import { exportToExcel } from "@/utils/export";
import { useProductCategoryTree } from "@/hooks/useProductCategoryTree";

import { getColumns } from "./components/ProductList/columns";
import { getFilterFields } from "./components/ProductList/filterFields";
import { mapProductExportData } from "./components/ProductList/productExportHelper";

import UpdateProductStatusModal from "./components/UpdateProductStatusModal";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import CommonFilterBar from "@/components/common/FilterBar";
import {
  defaultFilters,
  initialState,
  productListReducer,
} from "./components/ProductList/productListReducer";

const ProductList = () => {
  const navigate = useNavigate();
  const filtersRef = useRef(defaultFilters);
  const [state, dispatch] = useReducer(productListReducer, initialState);

  const { data: categoryOptions = [], isError: categoryError } =
    useProductCategoryTree();

  const debounceSearchOnly = useMemo(() => {
    return debounce((searchValue) => {
      const newFilters = {
        ...filtersRef.current,
        search: searchValue,
      };
      filtersRef.current = newFilters;
      dispatch({ type: "SET_FILTERS", payload: newFilters });
    }, 300);
  }, []);

  useEffect(() => () => debounceSearchOnly.cancel(), [debounceSearchOnly]);

  useEffect(() => {
    if (categoryError) toast.error("Không thể tải danh mục sản phẩm");
  }, [categoryError]);

  const handleFilterChange = useCallback(
    (rawFilters) => {
      const { search, ...others } = rawFilters;

      if (
        state.filterPendingOnly &&
        others.status &&
        others.status !== "pending"
      ) {
        dispatch({ type: "TOGGLE_PENDING_FILTER" });
      }

      // Cập nhật ngay các filter khác
      filtersRef.current = {
        ...filtersRef.current,
        ...others,
      };
      dispatch({
        type: "SET_FILTERS",
        payload: { ...filtersRef.current },
      });

      // Debounce riêng phần search
      debounceSearchOnly(search);
    },
    [debounceSearchOnly, state.filterPendingOnly]
  );

  useEffect(() => {
    const nextFilters = {
      ...filtersRef.current,
      status: state.filterPendingOnly ? "pending" : "",
    };
    debounceSearchOnly(nextFilters.search); // Optional nếu muốn sync search
    filtersRef.current = nextFilters;
    dispatch({ type: "SET_FILTERS", payload: nextFilters });
  }, [state.filterPendingOnly, debounceSearchOnly]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getSimpleApprovedEnterprises();
        const options = res.data?.data?.map((e) => ({
          label: e.name,
          value: e.id,
        }));
        dispatch({ type: "SET_ENTERPRISE_OPTIONS", payload: options });
      } catch {
        toast.error("Không thể tải danh sách doanh nghiệp");
      }
    })();
  }, []);

  const fetchProducts = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await getProductList({
        page: state.page,
        per_page: state.filters.perPage,
        ...state.filters,
        sort_by: state.sortBy,
        sort_order: state.sortOrder,
      });

      dispatch({
        type: "SET_PRODUCTS",
        products: res.data?.data || [],
        totalItems: res.data?.meta?.total || 0,
        totalPages: res.data?.meta?.last_page || 1,
      });
    } catch {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.page, state.filters, state.sortBy, state.sortOrder]);

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await getProductList({ status: "pending", per_page: 1 });
      dispatch({
        type: "SET_PENDING_COUNT",
        payload: res.data?.meta?.total || 0,
      });
    } catch {
      dispatch({ type: "SET_PENDING_COUNT", payload: 0 });
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchPendingCount();
  }, [fetchProducts, fetchPendingCount]);

  const handleModalAction = (type, product) => {
    dispatch({
      type: "OPEN_MODAL",
      payload: {
        name: type,
        key: `productTo${type.charAt(0).toUpperCase() + type.slice(1)}`,
        product,
      },
    });
  };

  const handleSoftDelete = async () => {
    try {
      await deleteProduct(state.modal.productToDelete.id); // mặc định xoá mềm
      toast.success("Xoá sản phẩm thành công");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xoá sản phẩm");
    } finally {
      dispatch({
        type: "CLOSE_MODAL",
        payload: {
          name: "delete",
          key: "productToDelete",
        },
      });
    }
  };

  const handleForceDelete = async () => {
    try {
      await deleteProduct(state.modal.productToForceDelete.id, { force: true }); // xoá vĩnh viễn
      toast.success("Xoá vĩnh viễn sản phẩm thành công");
      fetchProducts();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không thể xoá vĩnh viễn sản phẩm"
      );
    } finally {
      dispatch({
        type: "CLOSE_MODAL",
        payload: {
          name: "forceDelete",
          key: "productToForceDelete",
        },
      });
    }
  };

  const handleRestore = async () => {
    try {
      await adminRestoreProduct(state.modal.productToRestore.id);
      toast.success("Khôi phục sản phẩm thành công");
      fetchProducts();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không thể khôi phục sản phẩm"
      );
    } finally {
      dispatch({
        type: "CLOSE_MODAL",
        payload: {
          name: "restore",
          key: "productToRestore",
        },
      });
    }
  };

  return (
    <div className="product-list-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Danh sách sản phẩm</h2>
        <div className="d-flex gap-3">
          <Button onClick={() => navigate("/admin/products/create")}>
            + Thêm mới
          </Button>
          <Button
            variant={state.filterPendingOnly ? "danger" : "danger-outline"}
            onClick={() => dispatch({ type: "TOGGLE_PENDING_FILTER" })}
          >
            {`Chờ duyệt (${state.pendingCount})`}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              exportToExcel(
                mapProductExportData(state.products),
                "danh_sach_san_pham"
              )
            }
            disabled={state.loading}
          >
            {state.loading ? "Đang xử lý..." : "Xuất Excel"}
          </Button>
        </div>
      </div>

      <CommonFilterBar
        filters={filtersRef.current}
        onChange={handleFilterChange}
        fields={getFilterFields(categoryOptions, state.enterpriseOptions)}
      />

      <p className="total-count">Tổng cộng: {state.totalItems} sản phẩm</p>

      <DataTable
        columns={getColumns(
          navigate,
          (product) => handleModalAction("approve", product),
          (product) => handleModalAction("delete", product),
          (product) => handleModalAction("restore", product),
          state.filters.deleted === "only",
          (product) => handleModalAction("forceDelete", product)
        )}
        data={state.products}
        loading={state.loading}
        pagination={{
          page: state.page,
          totalPages: state.totalPages,
          onPageChange: (p) => dispatch({ type: "SET_PAGE", payload: p }),
        }}
        sort={{
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          onSortChange: (col, order) =>
            dispatch({ type: "SET_SORT", sortBy: col, sortOrder: order }),
        }}
      />

      <ConfirmModal
        open={state.modal.showDelete}
        title="Xác nhận xoá sản phẩm"
        message={<p>Bạn có chắc chắn muốn xoá sản phẩm này không?</p>}
        onCancel={() =>
          dispatch({
            type: "CLOSE_MODAL",
            payload: {
              name: "delete",
              key: "productToDelete",
            },
          })
        }
        onConfirm={handleSoftDelete}
      />
      <ConfirmModal
        open={state.modal.showForceDelete}
        title="Xác nhận xoá vĩnh viễn sản phẩm"
        message={
          <p>
            Sản phẩm này sẽ bị xoá <strong>vĩnh viễn</strong> và không thể khôi
            phục. Bạn có chắc chắn muốn tiếp tục?
          </p>
        }
        onCancel={() =>
          dispatch({
            type: "CLOSE_MODAL",
            payload: {
              name: "forceDelete",
              key: "productToForceDelete",
            },
          })
        }
        onConfirm={handleForceDelete}
      />

      <UpdateProductStatusModal
        open={state.modal.showApprove}
        product={state.modal.productToApprove}
        currentStatus={state.modal.productToApprove?.status}
        onCancel={() =>
          dispatch({
            type: "CLOSE_MODAL",
            payload: {
              name: "approve",
              key: "productToApprove",
            },
          })
        }
        onSubmit={async (values) => {
          try {
            await updateProductStatus(state.modal.productToApprove.id, values);
            toast.success("Cập nhật trạng thái sản phẩm thành công");
            fetchProducts();
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Không thể cập nhật trạng thái"
            );
          } finally {
            dispatch({
              type: "CLOSE_MODAL",
              payload: {
                name: "approve",
                key: "productToApprove",
              },
            });
          }
        }}
      />

      <ConfirmModal
        open={state.modal.showRestore}
        title="Khôi phục sản phẩm"
        message={<p>Bạn có chắc chắn muốn khôi phục sản phẩm này không?</p>}
        onCancel={() =>
          dispatch({
            type: "CLOSE_MODAL",
            name: "restore",
            key: "productToRestore",
          })
        }
        onConfirm={handleRestore}
      />
    </div>
  );
};

export default ProductList;
