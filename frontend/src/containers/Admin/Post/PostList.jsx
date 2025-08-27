import { useEffect, useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getPostList,
  deletePost,
  restorePost,
  forceDeletePost,
} from "@/services/admin/postsService";
import { getNewsCategoryTree } from "@/services/admin/newsCategoriesService";
import { flattenCategoryTreeForDropdown } from "@/utils/flattenCategoryTree";

import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import CommonFilterBar from "@/components/common/FilterBar";

import PostColumns from "./components/PostList/PostColumns";
import getPostFilterFields from "./components/PostList/PostFilters";
import PostConfirmModal from "./components/PostList/PostConfirmModal";

const PostList = () => {
  const navigate = useNavigate();

  // ---------------------------
  // State
  // ---------------------------
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    sort_by: "id",
    sort_order: "desc",
    perPage: 10,
    type: "", // news | event
    status: "",
    deleted: "",
    category_id: "",
  });

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postAction, setPostAction] = useState({});

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getNewsCategoryTree();
        const flattened = flattenCategoryTreeForDropdown(res.data?.data || []);
        setCategories(flattened);
      } catch (err) {
        console.log("🚀 ~ fetchCategories ~ err:", err);
        toast.error("Không thể tải danh mục bài viết");
      }
    };
    fetchCategories();
  }, []);

  // ---------------------------
  // Fetch posts
  // ---------------------------
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPostList({
        page,
        per_page: Number(filters.perPage) || 10,
        keyword: debouncedKeyword || undefined,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
        type: filters.type || undefined,
        status: filters.status || undefined,
        deleted: filters.deleted || undefined,
        category_id: filters.category_id || "",
      });

      setPosts(res.data?.data || []);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || 0);
    } catch {
      toast.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  }, [page, filters, debouncedKeyword]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ---------------------------
  // Confirm action
  // ---------------------------
  const handleConfirmAction = async () => {
    const { post, type } = postAction;
    try {
      if (type === "delete") await deletePost(post.id);
      else if (type === "force") await forceDeletePost(post.id);
      else if (type === "restore") await restorePost(post.id);

      toast.success(
        type === "restore" ? "Khôi phục thành công" : "Xoá thành công"
      );
      await fetchPosts();
    } catch {
      toast.error(type === "restore" ? "Khôi phục thất bại" : "Xoá thất bại");
    } finally {
      setShowConfirmModal(false);
      setPostAction({});
    }
  };

  // ---------------------------
  // Filter change
  // ---------------------------
  const handleFilterChange = (newFilters) => {
    const normalized = { ...newFilters };
    ["type", "status", "deleted"].forEach((field) => {
      if (!normalized[field] || normalized[field] === "0")
        normalized[field] = undefined;
      else normalized[field] = String(normalized[field]);
    });
    setFilters((prev) => ({ ...prev, ...normalized }));
    setPage(1);
  };

  const filterFields = useMemo(
    () => getPostFilterFields(categories),
    [categories]
  );

  const columns = useMemo(
    () =>
      PostColumns(navigate, (post, type) => {
        setPostAction({ post, type });
        setShowConfirmModal(true);
      }),
    [navigate]
  );

  return (
    <div className="post-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Quản lý bài viết (Tin tức & Sự kiện)</h2>
        <Button
          variant="primary"
          onClick={() => navigate("/admin/posts/create")}
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

      <p className="total-count">Tổng cộng: {totalItems} bài viết</p>

      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        pagination={{ page, totalPages, onPageChange: setPage }}
        sort={{
          sortBy: filters.sort_by,
          sortOrder: filters.sort_order,
          onSortChange: (col, order) =>
            handleFilterChange({ sort_by: col, sort_order: order }),
        }}
      />

      <PostConfirmModal
        open={showConfirmModal}
        actionType={postAction.type}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default PostList;
