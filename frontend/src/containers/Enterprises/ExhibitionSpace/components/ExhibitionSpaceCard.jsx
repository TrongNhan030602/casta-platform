import React from "react";
import { Card } from "react-bootstrap";
import { BsMap, BsRulers, BsCash, BsInfoCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import { getStorageUrl } from "@/utils/getStorageUrl";
import { formatCurrency } from "@/utils/formatCurrency";
import { EXHIBITION_SPACE_STATUSES } from "@/constants/exhibitionStatus";

const ExhibitionSpaceCard = ({ space, onRegister, contractStatus }) => {
  const navigate = useNavigate();

  const thumbnail = space.media?.find((m) => m.type === "image");
  const thumbnailUrl = thumbnail
    ? getStorageUrl(thumbnail.url)
    : "/images/no-image.webp";

  const statusInfo = EXHIBITION_SPACE_STATUSES[space.status] || {
    label: "Không rõ",
    color: "gray",
  };

  const { hasApproved, hasPending } = contractStatus || {};

  // Dùng để xét xem nút "Đăng ký" có active không
  const isAvailable =
    space.status === "available" && !hasApproved && !hasPending;

  // Gắn badge theo trạng thái hợp đồng
  let contractBadge = null;
  if (hasApproved) {
    contractBadge = (
      <Badge
        label="Đã đăng ký"
        color="primary"
        className="text-uppercase"
      />
    );
  } else if (hasPending) {
    contractBadge = (
      <Badge
        label="Đang chờ duyệt"
        color="warning"
        className="text-uppercase"
      />
    );
  } else {
    contractBadge = (
      <Badge
        label={statusInfo.label}
        color={statusInfo.color}
        className="text-uppercase"
      />
    );
  }

  return (
    <Card className="space-card h-100">
      <div className="space-card__image">
        <img
          src={thumbnailUrl}
          alt={space.name}
        />
      </div>

      <Card.Body className="d-flex flex-column justify-content-between">
        <div className="space-card__content">
          <div className="space-card__header d-flex justify-content-between align-items-center mb-2">
            <h5 className="space-card__title mb-0">{space.name}</h5>
            {contractBadge}
          </div>

          <div className="space-card__subtitle text-muted mb-2">
            <small>{space.code}</small>
          </div>

          <div className="space-card__meta text-muted mb-2">
            <div className="d-flex align-items-center mb-1">
              <BsMap className="me-2" />
              {space.location} - {space.zone}
            </div>
            <div className="d-flex align-items-center mb-1">
              <BsRulers className="me-2" />
              {space.size}
            </div>
            <div className="d-flex align-items-center">
              <BsCash className="me-2" />
              {formatCurrency(space.price)}/ ngày
            </div>
          </div>
        </div>

        <div className="space-card__actions mt-3 d-flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(`/enterprise/exhibition-spaces/${space.id}`)
            }
          >
            <BsInfoCircle className="me-1" />
            Chi tiết
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onRegister?.(space)}
            disabled={!isAvailable}
          >
            {hasApproved
              ? "Đã đăng ký"
              : hasPending
              ? "Đang chờ duyệt"
              : "Đăng ký"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExhibitionSpaceCard;
