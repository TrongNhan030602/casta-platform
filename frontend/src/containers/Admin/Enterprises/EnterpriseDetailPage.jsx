import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEnterpriseById } from "@/services/admin/enterpriseService";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EnterpriseInfoSection from "./components/EnterpriseInfoSection";
import LinkedAccountSection from "./components/LinkedAccountSection";
import ReviewerSection from "./components/ReviewerSection";
import DocumentSection from "./components/DocumentSection";
import ActionButtons from "./components/ActionButtons";
import "@/assets/styles/layout/admin/enterprise/enterprise-detail.css";

const EnterpriseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enterprise, setEnterprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchEnterprise = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const res = await getEnterpriseById(id);
      setEnterprise(res.data);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết doanh nghiệp:", err);
      toast.error("Không thể tải thông tin doanh nghiệp.");
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEnterprise();
  }, [fetchEnterprise]);

  const handleAction = async (actionFn) => {
    try {
      await actionFn(id);
      toast.success("Thao tác thành công");
      fetchEnterprise();
    } catch (err) {
      console.log(err);
      toast.error("Thao tác thất bại");
    }
  };

  if (loading) return <LoadingSpinner text="Đang tải thông tin..." />;
  if (error || !enterprise)
    return <p className="text-danger">Không tìm thấy doanh nghiệp.</p>;

  const { status } = enterprise;

  return (
    <div className="enterprise-detail-page">
      <div className="header">
        <h2 className="page-title">
          {enterprise.company_name} #{enterprise.id}
        </h2>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </Button>
      </div>

      <div className="content-grid">
        <div className="left-column">
          <div className="section">
            <h3>Thông tin doanh nghiệp</h3>
            <EnterpriseInfoSection enterprise={enterprise} />
          </div>

          <div className="section">
            <h3>Hồ sơ pháp lý</h3>
            <DocumentSection
              documents={enterprise.documents}
              enterpriseId={enterprise.id}
            />
          </div>
        </div>

        <div className="right-column">
          <div className="section">
            <h3>Thao tác quản trị</h3>
            <ActionButtons
              status={status}
              onBack={() => navigate(-1)}
              onAction={(actionFn) => handleAction(actionFn)}
            />
          </div>
          <div className="section">
            <h3>Tài khoản liên kết</h3>
            <LinkedAccountSection user={enterprise.user} />
          </div>

          {enterprise.reviewer && (
            <div className="section">
              <h3>Người xét duyệt</h3>
              <ReviewerSection
                reviewer={enterprise.reviewer}
                approvedAt={enterprise.approved_at}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDetailPage;
