import { useEffect, useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getTagList,
  deleteTag,
  restoreTag,
  forceDeleteTag,
} from "@/services/admin/tagsService";

import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import CommonFilterBar from "@/components/common/FilterBar";

import TagColumns from "./components/TagList/TagColumns";
import getTagFilterFields from "./components/TagList/getTagFilterFields";
import TagConfirmModal from "./components/TagList/TagConfirmModal";

const TagList = () => {
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
    perPage: 10,
    sort_by: "id",
    sort_order: "desc",
    deleted: "",
  });

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tagAction, setTagAction] = useState({});

  // Debounce keyword
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword.trim().length >= 3 ? keyword.trim() : "");
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [keyword]);

  // Fetch tags
  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        per_page: Number(filters.perPage) || 10,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
        q: debouncedKeyword || undefined,
      };

      if (filters.deleted === "only") params.only_trashed = true;
      else if (filters.deleted === "all") params.with_trashed = true;

      const res = await getTagList(params);

      setTags(res.data?.data || []);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || res.data?.data.length || 0);
    } catch {
      toast.error("Không thể tải danh sách tag");
    } finally {
      setLoading(false);
    }
  }, [page, filters, debouncedKeyword]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Confirm action
  const handleConfirmAction = async () => {
    const { tag, type } = tagAction;
    try {
      if (type === "delete") await deleteTag(tag.id);
      else if (type === "force") await forceDeleteTag(tag.id);
      else if (type === "restore") await restoreTag(tag.id);

      toast.success(
        type === "restore" ? "Khôi phục thành công" : "Xóa thành công"
      );
      await fetchTags();
    } catch {
      toast.error(type === "restore" ? "Khôi phục thất bại" : "Xóa thất bại");
    } finally {
      setShowConfirmModal(false);
      setTagAction({});
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const filterFields = useMemo(() => getTagFilterFields(), []);

  const columns = useMemo(
    () =>
      TagColumns(navigate, (tag, type) => {
        setTagAction({ tag, type });
        setShowConfirmModal(true);
      }),
    [navigate]
  );

  return (
    <div className="tag-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Quản lý Tag</h2>
        <Button
          variant="primary"
          onClick={() => navigate("/admin/tags/create")}
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

      <p className="total-count">Tổng cộng: {totalItems} tag</p>

      <DataTable
        columns={columns}
        data={tags}
        loading={loading}
        pagination={{ page, totalPages, onPageChange: setPage }}
        sort={{
          sortBy: filters.sort_by,
          sortOrder: filters.sort_order,
          onSortChange: (col, order) =>
            handleFilterChange({ sort_by: col, sort_order: order }),
        }}
      />

      <TagConfirmModal
        open={showConfirmModal}
        actionType={tagAction.type}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default TagList;
