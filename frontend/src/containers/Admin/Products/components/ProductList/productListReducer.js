// utils
export function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// default filter
export const defaultFilters = {
  keyword: "",
  status: "",
  category_id: "",
  enterprise_id: "",
  price_min: "",
  price_max: "",
  deleted: "none",
  perPage: 10,
};

// initial state
export const initialState = {
  filters: defaultFilters,
  page: 1,
  sortBy: "id",
  sortOrder: "asc",
  loading: false,
  products: [],
  totalItems: 0,
  totalPages: 1,
  filterPendingOnly: false,
  enterpriseOptions: [],
  pendingCount: 0,
  modal: {
    showApprove: false,
    showDelete: false,
    showRestore: false,
    productToApprove: null,
    productToDelete: null,
    productToRestore: null,
  },
};

// reducer
export function productListReducer(state, action) {
  switch (action.type) {
    case "SET_FILTERS":
      return { ...state, filters: action.payload, page: 1 };

    case "SET_PAGE":
      return { ...state, page: action.payload };

    case "SET_SORT":
      return {
        ...state,
        sortBy: action.sortBy,
        sortOrder: action.sortOrder,
        page: 1,
      };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.products,
        totalItems: action.totalItems,
        totalPages: action.totalPages,
      };

    case "SET_ENTERPRISE_OPTIONS":
      return { ...state, enterpriseOptions: action.payload };

    case "SET_PENDING_COUNT":
      return { ...state, pendingCount: action.payload };

    case "TOGGLE_PENDING_FILTER":
      return { ...state, filterPendingOnly: !state.filterPendingOnly };

    case "OPEN_MODAL": {
      const { name, key, product } = action.payload || {};
      if (!name || !key) return state; // Guard fallback

      return {
        ...state,
        modal: {
          ...state.modal,
          [`show${capitalizeFirst(name)}`]: true,
          [key]: product,
        },
      };
    }

    case "CLOSE_MODAL": {
      const { name, key } = action.payload || {};
      if (!name || !key) return state; // Guard fallback

      return {
        ...state,
        modal: {
          ...state.modal,
          [`show${capitalizeFirst(name)}`]: false,
          [key]: null,
        },
      };
    }

    default:
      return state;
  }
}
