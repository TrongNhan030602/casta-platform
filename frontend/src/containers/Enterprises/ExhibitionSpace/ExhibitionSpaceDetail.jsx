import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import { toast } from "react-toastify";

import { getExhibitionSpaceById } from "@/services/enterprise/exhibitionSpaceService";
import { getMyRentalContracts } from "@/services/enterprise/rentalContractService";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import TwoColumnLayout from "@/layout/TwoColumnLayout";

import SpaceInfo from "./components/SpaceInfo";
import SpaceVirtualTourButton from "./components/SpaceVirtualTourButton";
import PanoramaViewer from "./components/PanoramaViewer";
import FeedbackModal from "./components/FeedbackModal";

import "@/assets/styles/layout/enterprise/exhibition-space/exhibition-space-detail.css";

const ExhibitionSpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [myContracts, setMyContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPanoramaViewer, setShowPanoramaViewer] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Lấy thông tin không gian
  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const res = await getExhibitionSpaceById(id);
        setSpace(res.data?.data || null);
      } catch (err) {
        console.error("Lỗi khi tải không gian:", err);
        toast.error("Không thể tải thông tin không gian.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpace();
  }, [id]);

  // Lấy danh sách hợp đồng của tôi
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await getMyRentalContracts();
        setMyContracts(res.data?.data || []);
      } catch (err) {
        console.error("Lỗi khi tải hợp đồng:", err);
      }
    };

    fetchContracts();
  }, []);

  // ✅ Xác định xem DN có thuê không gian này không
  const hasRentedThisSpace = useMemo(() => {
    return myContracts.some(
      (contract) =>
        contract.space?.id === space?.id && contract.status === "approved"
    );
  }, [myContracts, space]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <LoadingSpinner text="Đang tải chi tiết không gian..." />
      </div>
    );
  }

  if (!space) {
    return (
      <p className="text-danger text-center">Không tìm thấy không gian.</p>
    );
  }

  return (
    <>
      <TwoColumnLayout
        title={space.name}
        backButton={
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </Button>
        }
        leftChildren={
          <>
            <div className="section">
              <h3>Thông tin chi tiết</h3>
              <SpaceInfo space={space} />
            </div>
          </>
        }
        rightChildren={
          <div className="section">
            <h3>Tham quan không gian</h3>
            <SpaceVirtualTourButton
              onStart={() => setShowPanoramaViewer(true)}
            />
            {hasRentedThisSpace && (
              <div className="section mt-3">
                <Button
                  variant="primary"
                  onClick={() => setShowFeedbackModal(true)}
                >
                  Gửi phản hồi
                </Button>
              </div>
            )}
          </div>
        }
      />

      {showPanoramaViewer && (
        <PanoramaViewer
          show={showPanoramaViewer}
          onHide={() => setShowPanoramaViewer(false)}
          panoramas={space.media.filter((m) => m.type === "panorama")}
        />
      )}

      {/* ✅ Modal phản hồi */}
      {showFeedbackModal && (
        <FeedbackModal
          open={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          space={space}
          onSuccess={() => {
            toast.success("Cảm ơn bạn đã gửi phản hồi.");
            setShowFeedbackModal(false);
          }}
        />
      )}
    </>
  );
};

export default ExhibitionSpaceDetail;
