import { formatCurrency } from "@/utils/formatCurrency";
import { EXHIBITION_SPACE_STATUSES } from "@/constants/exhibitionStatus";
import Badge from "@/components/common/Badge";

const SpaceInfo = ({ space }) => (
  <div className="space-info">
    <div className="space-info__group">
      <div className="space-info__item">
        <span className="space-info__label">Vị trí:</span>
        <span className="space-info__value">{space.location}</span>
      </div>
      <div className="space-info__item">
        <span className="space-info__label">Khu vực:</span>
        <span className="space-info__value">{space.zone}</span>
      </div>
      <div className="space-info__item">
        <span className="space-info__label">Diện tích:</span>
        <span className="space-info__value">{space.size}</span>
      </div>
      <div className="space-info__item">
        <span className="space-info__label">Danh mục:</span>
        <span className="space-info__value">{space.category_name}</span>
      </div>
    </div>

    <div className="space-info__group">
      <div className="space-info__item">
        <span className="space-info__label">Trạng thái:</span>
        <span className="space-info__value">
          <Badge
            label={
              EXHIBITION_SPACE_STATUSES[space.status]?.label || space.status
            }
            color={EXHIBITION_SPACE_STATUSES[space.status]?.color || "gray"}
          />
        </span>
      </div>

      <div className="space-info__item">
        <span className="space-info__label">Giá thuê:</span>
        <span className="space-info__value">
          {formatCurrency(space.price)} / ngày
        </span>
      </div>
      <div className="space-info__item">
        <span className="space-info__label">Mô tả:</span>
        <span className="space-info__value">{space.description}</span>
      </div>
    </div>
  </div>
);

export default SpaceInfo;
