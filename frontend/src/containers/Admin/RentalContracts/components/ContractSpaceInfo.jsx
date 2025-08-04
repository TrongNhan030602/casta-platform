import { Link } from "react-router-dom"; // Đảm bảo bạn đã import Link

const ContractSpaceInfo = ({ contract }) => {
  const { space } = contract;

  return (
    <div className="contract-detail__section mb-4">
      <h5 className="contract-detail__section-title">Thông tin không gian</h5>
      <p>
        <strong>Mã:</strong> {space.code}
      </p>
      <p>
        <strong>Tên:</strong>{" "}
        <Link
          to={`/admin/exhibition-spaces/${space.id}`}
          className="text-decoration-underline"
        >
          {space.name}
        </Link>
      </p>
      <p>
        <strong>Vị trí:</strong> {space.location}
      </p>
      <p>
        <strong>Danh mục:</strong> {space.category}
      </p>
    </div>
  );
};

export default ContractSpaceInfo;
