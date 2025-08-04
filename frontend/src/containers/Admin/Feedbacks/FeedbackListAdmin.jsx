import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { FaHashtag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import {
  FEEDBACK_TYPE_OPTIONS,
  FEEDBACK_STATUS_OPTIONS,
} from "@/constants/feedback";

import Button from "@/components/common/Button";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import CommonFilterBar from "@/components/common/FilterBar";
import Badge from "@/components/common/Badge";
import ReplyModal from "./components/ReplyModal";
import {
  getAllFeedbacks,
  deleteFeedback,
  replyFeedback,
} from "@/services/admin/feedbackService";
import { formatDateTime } from "@/utils/formatDateTime";

const allowedSorts = ["id", "rating", "created_at", "updated_at"];

const FeedbackListAdmin = () => {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    status: "",
    perPage: 10,
  });

  const { keyword, type, status, perPage } = filters;

  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  // Debounce keyword input
  const debounceKeyword = useMemo(
    () =>
      debounce((value) => {
        setDebouncedKeyword(value);
      }, 300),
    []
  );

  useEffect(() => {
    debounceKeyword(keyword);
  }, [keyword, debounceKeyword]);

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllFeedbacks({
        page,
        per_page: perPage,
        keyword: debouncedKeyword || undefined,
        type: type || undefined,
        status: status || undefined,
        sort_by: allowedSorts.includes(sortBy) ? sortBy : "created_at",
        sort_order: ["asc", "desc"].includes(sortOrder) ? sortOrder : "desc",
      });
      setFeedbacks(res.data?.data || []);
      setTotalPages(res.data?.meta?.last_page || 1);
      setTotalItems(res.data?.meta?.total || 0);
    } catch (err) {
      console.error("Lỗi khi tải phản hồi:", err);
      toast.error(
        err.response?.data?.message || "Không thể tải danh sách phản hồi"
      );
    } finally {
      setLoading(false);
    }
  }, [page, perPage, debouncedKeyword, type, status, sortBy, sortOrder]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (column, order) => {
    if (!allowedSorts.includes(column)) {
      toast.warn("Không thể sắp xếp theo cột này");
      return;
    }
    setSortBy(column);
    setSortOrder(order);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!selectedFeedback) return;
    try {
      await deleteFeedback(selectedFeedback.id);
      toast.success("Xóa phản hồi thành công");
      fetchFeedbacks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa phản hồi");
    } finally {
      setDeleteModalOpen(false);
      setSelectedFeedback(null);
    }
  };

  const handleReply = async (content) => {
    if (!selectedFeedback) return;
    try {
      await replyFeedback(selectedFeedback.id, content);
      toast.success("Đã gửi phản hồi thành công");
      fetchFeedbacks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi phản hồi thất bại");
    } finally {
      setReplyModalOpen(false);
      setSelectedFeedback(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        label: "ID",
        key: "id",
        sortable: true,
        render: (row) => (
          <button
            className="link-button"
            onClick={() => navigate(`/admin/feedbacks/${row.id}`)}
          >
            <FaHashtag /> {row.id}
          </button>
        ),
      },
      {
        label: "Đối tượng",
        render: (row) => `${row.target_name} (${row.type})`,
      },
      {
        label: "Người gửi",
        render: (row) => row.user?.name || "--",
      },
      {
        label: "Nội dung",
        render: (row) => row.content,
      },
      {
        label: "Sao",
        key: "rating",
        sortable: true,
        render: (row) => row.rating,
      },
      {
        label: "Trạng thái",
        render: (row) => (
          <Badge
            label={row.status === "resolved" ? "Đã phản hồi" : "Chưa phản hồi"}
            color={row.status === "resolved" ? "success" : "warning"}
          />
        ),
      },
      {
        label: "Thời gian",
        key: "created_at",
        sortable: true,
        render: (row) => formatDateTime(row.created_at),
      },
      {
        label: "Hành động",
        render: (row) => (
          <div className="d-flex gap-2">
            {row.status !== "resolved" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedFeedback(row);
                  setReplyModalOpen(true);
                }}
              >
                Phản hồi
              </Button>
            )}
            <Button
              size="sm"
              variant="danger-outline"
              onClick={() => {
                setSelectedFeedback(row);
                setDeleteModalOpen(true);
              }}
            >
              Xóa
            </Button>
          </div>
        ),
      },
    ],
    [navigate]
  );
  const waitingCount = useMemo(
    () => feedbacks.filter((f) => f.status === "new").length,
    [feedbacks]
  );

  return (
    <div className="feedback-list-admin">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Phản hồi người dùng</h2>
        <Button
          variant={filters.status === "new" ? "danger" : "danger-outline"}
          onClick={() =>
            handleFilterChange({
              ...filters,
              status: filters.status === "new" ? "" : "new", // toggle
            })
          }
        >
          Chờ phản hồi ({waitingCount})
        </Button>
      </div>

      <CommonFilterBar
        filters={filters}
        onChange={handleFilterChange}
        fields={[
          {
            name: "keyword",
            type: "text",
            placeholder: "Tìm theo nội dung/người gửi",
          },
          {
            name: "type",
            type: "select",
            options: FEEDBACK_TYPE_OPTIONS,
          },
          {
            name: "status",
            type: "select",
            options: FEEDBACK_STATUS_OPTIONS,
          },
        ]}
      />

      <p className="total-count">Tổng cộng: {totalItems} phản hồi</p>

      <DataTable
        columns={columns}
        data={feedbacks}
        loading={loading}
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
        sort={{
          sortBy,
          sortOrder,
          onSortChange: handleSortChange,
        }}
      />

      {!loading && feedbacks.length === 0 && (
        <div className="text-center text-muted my-4">
          Không có phản hồi nào.
        </div>
      )}

      <ConfirmModal
        open={deleteModalOpen}
        title="Xác nhận xóa phản hồi"
        message={<p>Bạn có chắc chắn muốn xóa phản hồi này không?</p>}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
      <ReplyModal
        open={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        onSubmit={handleReply}
        feedback={selectedFeedback}
      />
    </div>
  );
};

export default FeedbackListAdmin;
