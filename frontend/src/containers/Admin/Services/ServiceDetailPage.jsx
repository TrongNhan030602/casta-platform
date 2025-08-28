import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

import { getStorageUrl } from "@/utils/getStorageUrl";
import { getServiceById } from "@/services/admin/servicesService";
import { formatDateTime } from "@/utils/formatDateTime";
import { formatCurrency } from "@/utils/formatCurrency";

import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import "@/assets/styles/layout/admin/service/service-detai.css";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await getServiceById(id);
        setService(res.data?.data);
      } catch (err) {
        console.log("🚀 ~ fetchService ~ err:", err);
        toast.error("Không thể tải dịch vụ");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <LoadingSpinner text="Đang tải dữ liệu" />;
  if (!service)
    return <p className="text-center text-muted">Dịch vụ không tồn tại</p>;

  const mainImage = service.media?.length > 0 ? service.media[0] : null;

  return (
    <div className="service-detail container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="service-detail__title">{service.name}</h2>
        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/services")}
          >
            <FaArrowLeft /> Quay lại
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/admin/services/${service.id}/edit`)}
          >
            <FaEdit /> Chỉnh sửa
          </Button>
        </div>
      </div>

      {/* Meta */}
      <div className="service-detail__meta mb-3">
        <span className="me-3">Danh mục: {service.category?.name}</span>
        <span className="me-3">Giá: {formatCurrency(service.price)}</span>
        <span className="me-3">Thời gian: {service.duration_minutes} phút</span>
        <span className="me-3">Tác giả: {service.created_by?.name}</span>
        <span className="me-3">
          Ngày tạo: {formatDateTime(service.created_at)}
        </span>
      </div>

      {/* Tags */}
      {service.tags?.length > 0 && (
        <div className="service-detail__tags mt-3">
          {service.tags.map((tag) => (
            <Badge
              key={tag.id}
              color="secondary"
              className="me-2"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Summary */}
      {service.summary && (
        <p className="service-detail__summary lead text-muted">
          {service.summary}
        </p>
      )}

      {/* Features */}
      {service.features?.length > 0 && (
        <div className="service-detail__features mb-3">
          <h5>Đặc điểm nổi bật:</h5>
          <ul>
            {service.features.map((f, idx) => (
              <li key={idx}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Image */}
      {mainImage && (
        <div className="service-detail__image mb-4">
          <img
            className="w-100 rounded shadow-sm"
            src={getStorageUrl(mainImage.path)}
            alt={service.name}
          />
        </div>
      )}

      {/* Content */}
      {service.content && (
        <article
          className="service-detail__content mb-4"
          dangerouslySetInnerHTML={{ __html: service.content }}
        />
      )}
    </div>
  );
};

export default ServiceDetailPage;
