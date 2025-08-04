import { EXHIBITION_SPACE_STATUSES } from "@/constants/exhibitionStatus";
import Badge from "@/components/common/Badge";

const BasicInfo = ({ spaceDetail }) => {
  const status = EXHIBITION_SPACE_STATUSES[spaceDetail.status];

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(spaceDetail.price);

  return (
    <div className="section">
      <h3 className="section-title">Thông tin không gian</h3>
      <p>
        <strong>Mã:</strong> {spaceDetail.code}
      </p>
      <p>
        <strong>Vị trí:</strong> {spaceDetail.location}
      </p>
      <p>
        <strong>Khu vực:</strong> {spaceDetail.zone}
      </p>
      <p>
        <strong>Kích thước:</strong> {spaceDetail.size}
      </p>
      <p>
        <strong>Giá:</strong> {formattedPrice}
      </p>
      <p>
        <strong>Mô tả:</strong> {spaceDetail.description}
      </p>
      <p>
        <strong>Trạng thái:</strong>{" "}
        <Badge
          label={status?.label}
          color={status?.color}
        />
      </p>
    </div>
  );
};

export default BasicInfo;
