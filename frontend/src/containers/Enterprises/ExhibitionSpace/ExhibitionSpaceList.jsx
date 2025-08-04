import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

import {
  getExhibitionSpaces,
  getExhibitionSpaceCategoryTree,
} from "@/services/enterprise/exhibitionSpaceService";
import { getMyRentalContracts } from "@/services/enterprise/rentalContractService";

import flattenCategoryTree from "@/utils/flattenCategoryTree";

import Button from "@/components/common/Button";
import RegisterSpaceModal from "./components/RegisterSpaceModal";
import MyRentalContractsList from "./MyRentalContractsList";

import { getFilterFields } from "./components/ExhibitionSpaceList/filterFields";
import {
  buildContractStatusMap,
  getStatusForSpace as getStatusRaw,
} from "./components/ExhibitionSpaceList/statusMapHelper";
import { renderSpacesTab } from "./components/ExhibitionSpaceList/renderSpacesTab";

import "@/assets/styles/layout/enterprise/exhibition-space/exhibition-space-list.css";

const DEFAULT_FILTERS = {
  keyword: "",
  status: "available",
  category_id: "",
};

const ExhibitionSpaceList = () => {
  const [activeTab, setActiveTab] = useState("spaces");
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [myContracts, setMyContracts] = useState([]);

  // --- Fetch không gian ---
  const fetchSpaces = useCallback(
    async (localFilters = filters, localPage = page) => {
      setLoading(true);
      try {
        const res = await getExhibitionSpaces({
          page: localPage,
          per_page: perPage,
          keyword: localFilters.keyword || undefined,
          status: localFilters.status || undefined,
          category_id: localFilters.category_id || undefined,
        });
        setSpaces(res.data?.data || []);
        setTotalPages(res.data?.meta?.last_page || 1);
        setTotalItems(res.data?.meta?.total || 0);
      } catch (error) {
        console.error("fetchSpaces error:", error);
        toast.error("Không thể tải danh sách không gian.");
      } finally {
        setLoading(false);
      }
    },
    [filters, page, perPage]
  );

  // --- Fetch hợp đồng ---
  const fetchContracts = useCallback(async () => {
    try {
      const res = await getMyRentalContracts();
      setMyContracts(res.data?.data || []);
    } catch (err) {
      console.error("fetchContracts error:", err);
      toast.error("Không thể tải danh sách hợp đồng.");
    }
  }, []);

  // --- Debounce khi filter ---
  const debouncedFetch = useMemo(
    () => debounce(fetchSpaces, 500),
    [fetchSpaces]
  );

  useEffect(() => {
    if (activeTab === "spaces") debouncedFetch(filters, page);
    return () => debouncedFetch.cancel();
  }, [filters, page, activeTab, debouncedFetch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getExhibitionSpaceCategoryTree();
        const flat = flattenCategoryTree(res.data?.data || []);
        setCategoryOptions([{ label: "Danh mục", value: "" }, ...flat]);
      } catch (err) {
        console.error("fetchCategories error:", err);
        toast.error("Không thể tải danh mục.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const contractStatusMap = useMemo(
    () => buildContractStatusMap(myContracts),
    [myContracts]
  );
  const getStatusForSpace = (id) => getStatusRaw(id, contractStatusMap);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterFields = useMemo(
    () => getFilterFields(categoryOptions),
    [categoryOptions]
  );

  return (
    <div className="enterprise-space-list container py-4">
      {/* Tabs */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="page-title mb-0">
          {activeTab === "spaces"
            ? "Danh sách không gian trưng bày"
            : "Hợp đồng của tôi"}
        </h2>
        <div>
          <Button
            variant={activeTab === "spaces" ? "primary" : "outline"}
            className="me-2"
            onClick={() => setActiveTab("spaces")}
          >
            Không gian
          </Button>
          <Button
            variant={activeTab === "contracts" ? "primary" : "outline"}
            onClick={() => setActiveTab("contracts")}
          >
            Hợp đồng của tôi
          </Button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "spaces" ? (
        renderSpacesTab({
          filters,
          filterFields,
          onFilterChange: handleFilterChange,
          spaces,
          page,
          totalPages,
          totalItems,
          loading,
          getStatusForSpace,
          setSelectedSpace,
          onPageChange: handlePageChange,
        })
      ) : (
        <MyRentalContractsList />
      )}

      {/* Modal */}
      {selectedSpace && (
        <RegisterSpaceModal
          open
          space={selectedSpace}
          onClose={() => setSelectedSpace(null)}
          onSuccess={async () => {
            setSelectedSpace(null);
            await fetchSpaces();
            await fetchContracts();
          }}
        />
      )}
    </div>
  );
};

export default ExhibitionSpaceList;
