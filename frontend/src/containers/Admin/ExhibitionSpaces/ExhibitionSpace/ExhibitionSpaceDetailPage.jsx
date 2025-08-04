import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";

import {
  getExhibitionSpaceById,
  uploadExhibitionSpaceMedia,
  deleteExhibitionSpaceMedia,
  updateExhibitionSpaceMedia,
  getEnterprisesInSpace,
} from "@/services/admin/exhibitionSpaceService";

import { FEEDBACK_STATUS_OPTIONS } from "@/constants/feedback";

import BasicInfo from "./components/BasicInfo";
import AdminActions from "./components/AdminActions";
import MediaDisplay from "./components/MediaDisplay";
import MediaUploadForm from "./components/MediaUploadForm";
import TenantInfo from "./components/TenantInfo";
import ProductApprovalTab from "./components/ProductApprovalTab";
import FeedbackTab from "./components/FeedbackTab";
import Space360Viewer from "./components/Space360Viewer";

import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ConfirmModal from "@/components/common/ConfirmModal";
import CommonFilterBar from "@/components/common/FilterBar";

import "@/assets/styles/layout/admin/exhibition-space/exhibition-space-detail.css";

const ExhibitionSpaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [spaceDetail, setSpaceDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [mediaToEdit, setMediaToEdit] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");

  const [tenants, setTenants] = useState([]);
  const [tenantLoading, setTenantLoading] = useState(false);

  const [is360ViewerOpen, setIs360ViewerOpen] = useState(false);

  const [rawFilters, setRawFilters] = useState({});
  const [feedbackFilters, setFeedbackFilters] = useState({
    sort_by: "created_at",
    sort_order: "desc",
  });

  const feedbackFilterFields = [
    {
      name: "keyword",
      type: "text",
      placeholder: "Tìm theo nội dung hoặc tên người gửi...",
    },
    {
      name: "status",
      type: "select",
      options: FEEDBACK_STATUS_OPTIONS,
    },
    {
      name: "sort_order",
      type: "select",
      options: [
        { label: "Mới nhất", value: "desc" },
        { label: "Cũ nhất", value: "asc" },
      ],
    },
  ];

  const debouncedSetKeyword = useCallback((keyword) => {
    debounce(() => {
      setFeedbackFilters((prev) => ({ ...prev, keyword }));
    }, 500)();
  }, []);

  const handleFilterChange = (newFilters) => {
    setRawFilters(newFilters);

    // debounce riêng keyword
    if ("keyword" in newFilters) {
      debouncedSetKeyword(newFilters.keyword);
    }

    const { status, sort_order } = newFilters;

    setFeedbackFilters((prev) => ({
      ...prev,
      ...(status !== undefined ? { status } : {}),
      ...(sort_order ? { sort_order, sort_by: "created_at" } : {}),
    }));
  };

  useEffect(() => {
    const fetchSpaceDetail = async () => {
      setLoading(true);
      try {
        const res = await getExhibitionSpaceById(id);
        setSpaceDetail(res.data?.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết không gian:", err);
        toast.error("Không thể tải chi tiết không gian");
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceDetail();
  }, [id]);

  useEffect(() => {
    const fetchTenants = async () => {
      setTenantLoading(true);
      try {
        const res = await getEnterprisesInSpace(id);
        setTenants(res.data?.data || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách doanh nghiệp thuê:", err);
        toast.error("Không thể tải danh sách doanh nghiệp thuê.");
      } finally {
        setTenantLoading(false);
      }
    };

    if (id) fetchTenants();
  }, [id]);

  const handleDeleteMedia = async () => {
    try {
      await deleteExhibitionSpaceMedia(id, mediaToDelete.id);
      toast.success("Xoá media thành công");
      setSpaceDetail((prev) => ({
        ...prev,
        media: prev.media.filter((m) => m.id !== mediaToDelete.id),
      }));
    } catch (err) {
      console.error("Lỗi xoá media:", err);
      toast.error("Lỗi khi xoá media");
    } finally {
      setShowDeleteModal(false);
      setMediaToDelete(null);
    }
  };

  const handleStatusChange = (newStatus) => {
    setSpaceDetail((prev) => ({
      ...prev,
      status: newStatus,
    }));
    toast.success("Cập nhật trạng thái thành công!");
  };

  if (loading) return <LoadingSpinner text="Đang tải không gian..." />;
  if (!spaceDetail) return <p>Không tìm thấy không gian trưng bày.</p>;

  return (
    <div className="exhibition-space-detail">
      <div className="exhibition-space-detail__header">
        <h2 className="page-title">
          {spaceDetail.name} #{spaceDetail.id}
        </h2>

        {spaceDetail?.media?.some((m) => m.type === "panorama") && (
          <Button
            variant="primary"
            onClick={() => setIs360ViewerOpen(true)}
          >
            👁️‍🗨️ Xem 360°
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </Button>
      </div>

      <div className="exhibition-space-detail__tabs">
        {[
          { key: "overview", label: "Thông tin" },
          { key: "tenant", label: "Doanh nghiệp đang / sắp thuê" },
          { key: "products", label: "Sản phẩm chờ duyệt" },
          { key: "feedback", label: "Góp ý / Phản hồi" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`exhibition-space-detail__tab ${
              activeTab === key ? "exhibition-space-detail__tab--active" : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "feedback" && (
        <div className="feedback-tab__filter-bar">
          <CommonFilterBar
            filters={rawFilters}
            onChange={handleFilterChange}
            fields={feedbackFilterFields}
          />
        </div>
      )}

      <div className="exhibition-space-detail__content">
        {activeTab === "overview" && (
          <>
            <div className="exhibition-space-detail__left-column">
              <BasicInfo spaceDetail={spaceDetail} />
              <MediaDisplay
                media={spaceDetail.media}
                setMediaToDelete={setMediaToDelete}
                setShowDeleteModal={setShowDeleteModal}
                setMediaToEdit={setMediaToEdit}
              />
            </div>
            <div className="exhibition-space-detail__right-column">
              <AdminActions
                spaceId={id}
                onStatusChange={handleStatusChange}
                isLoading={loading}
              />
              <MediaUploadForm
                mediaToEdit={mediaToEdit}
                setMediaToEdit={setMediaToEdit}
                onSubmit={async (formData) => {
                  try {
                    if (mediaToEdit) {
                      await updateExhibitionSpaceMedia(
                        id,
                        mediaToEdit.id,
                        formData
                      );
                      toast.success("Cập nhật media thành công");
                    } else {
                      await uploadExhibitionSpaceMedia(id, formData);
                      toast.success("Tải lên media thành công");
                    }
                    const res = await getExhibitionSpaceById(id);
                    setSpaceDetail(res.data?.data);
                    return true;
                  } catch (err) {
                    console.error("Lỗi xử lý media:", err);
                    toast.error("Có lỗi xảy ra khi gửi media");
                    return false;
                  }
                }}
              />
            </div>
          </>
        )}

        {activeTab === "tenant" && (
          <TenantInfo
            tenants={tenants}
            loading={tenantLoading}
          />
        )}

        {activeTab === "products" && <ProductApprovalTab spaceId={id} />}

        {activeTab === "feedback" && (
          <FeedbackTab
            spaceId={id}
            filters={feedbackFilters}
          />
        )}
      </div>

      <ConfirmModal
        open={showDeleteModal}
        title="Xác nhận xoá media"
        message="Bạn có chắc chắn muốn xoá media này?"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteMedia}
      />

      <Space360Viewer
        show={is360ViewerOpen}
        onHide={() => setIs360ViewerOpen(false)}
        panoramas={spaceDetail.media.filter((m) => m.type === "panorama")}
      />
    </div>
  );
};

export default ExhibitionSpaceDetailPage;
