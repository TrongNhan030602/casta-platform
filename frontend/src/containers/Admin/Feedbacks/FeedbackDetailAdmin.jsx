import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedbackById } from "@/services/admin/feedbackService";
import { toast } from "react-toastify";

import Button from "@/components/common/Button";
import TwoColumnLayout from "@/layout/TwoColumnLayout";
import FeedbackGeneralInfo from "./components/FeedbackGeneralInfo";
import FeedbackTargetInfo from "./components/FeedbackTargetInfo";
import FeedbackActions from "./components/FeedbackActions";
import "@/assets/styles/layout/admin/feedback/feedback-detail.css";
const FeedbackDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getFeedbackById(id);
        setFeedback(res.data?.data);
      } catch (err) {
        console.error("🚨 Lỗi tải chi tiết phản hồi:", err);
        toast.error("Không thể tải chi tiết phản hồi");
        navigate("/admin/feedbacks");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  if (loading) return <p>Đang tải...</p>;
  if (!feedback) return null;

  return (
    <div className="feedback-detail container py-4">
      <TwoColumnLayout
        title={`Phản hồi #${feedback.id}`}
        backButton={
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </Button>
        }
        leftWidth="1fr"
        rightWidth="1fr"
        leftChildren={
          <>
            <FeedbackGeneralInfo feedback={feedback} />
            <FeedbackTargetInfo feedback={feedback} />
          </>
        }
        rightChildren={
          <>
            <FeedbackActions
              feedback={feedback}
              onUpdate={setFeedback}
            />
          </>
        }
      />
    </div>
  );
};

export default FeedbackDetailAdmin;
